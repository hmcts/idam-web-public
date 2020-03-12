#!/usr/bin/python

# constants
##################################################
MESSAGE_TAG = """<spring:message code="%s" />"""

KEY_PREFIX = 'public.cookies.'
KEY_MAX_LENGTH = 20

FILE_EXTENSIONS = '.jsp,'

# functions
##################################################
# generate key from text: "a great title" -> a.great.title
def get_key(text):
    key = text.lower()

    # replace special chars by single space
    special_chars = """~`!@#$%^&*()-_+=|\{}[]""':;,.<>/?\t"""
    for i in range(len(special_chars)):
        key = key.replace(special_chars[i], " ")

    # replace double spaces by single space
    key = key.replace("  ", " ")
    key = key.replace("  ", " ")

    key = key.strip()
    key = key.replace(" ", "_")
    key = key[:KEY_MAX_LENGTH]
    key = key
    return key

# add number suffix (if necessary to avoid duplication) and prefix to key: admin.a.great.title2
def get_final_key(key):
    global properties
    final_key = KEY_PREFIX + key
    i = 2
    while(final_key in properties.keys() or final_key == KEY_PREFIX + ''):
        final_key = KEY_PREFIX + key + str(i)
        i+=1
    return final_key

# replace text replaced by message tag: "<spring:message code="admin.a.great.title2" />"
def get_new_text(l, text, key):
    tag = MESSAGE_TAG % key
    return l.replace(text, tag)

# process plain text
def process_text(text):
    global properties, current_file_path
    text_strip = text.strip()
    if text_strip:
        if text_strip in properties.values():
            final_key = [k for k, v in properties.iteritems() if v == text_strip][0]
        else:
            key = get_key(text_strip)
            final_key = get_final_key(key)
            properties[final_key] = text_strip
            global is_first_key_in_file
            if is_first_key_in_file:
                print "# " + os.path.basename(current_file_path)
                is_first_key_in_file = False
            print final_key + '=' + text_strip
        return get_new_text(text, text_strip, final_key)
    else:
        return text

# process a line
def process_line(l):
    str_parts = []
    open_tags = 0
    open_el = -1
    tmp_str=''
    for i, char in enumerate(l):
        if open_el == -1:
            if char == '$':
                if i+1 < len(l) and l[i+1] == '{':
                    if open_tags == 0:
                        tmp_str = process_text(tmp_str)
                    str_parts.append(tmp_str)
                    tmp_str = ''
                    open_el = 0
                tmp_str += char
            elif char == '<':
                if open_tags == 0:
                    tmp_str = process_text(tmp_str)
                    str_parts.append(tmp_str)
                    tmp_str = ''
                tmp_str += char
                open_tags += 1
            elif char == '>':
                tmp_str += char
                open_tags -= 1
                if open_tags == 0:
                    str_parts.append(tmp_str)
                    tmp_str = ''
            else:
                tmp_str += char
        else:
            if char == '{':
                open_el += 1
                tmp_str += char
            elif char == '}':
                open_el -= 1
                tmp_str += char
                if (open_el == 0):
                    str_parts.append(tmp_str)
                    tmp_str = ''
                    open_el = -1
            else:
                tmp_str += char
    tmp_str = process_text(tmp_str)
    str_parts.append(tmp_str)

    return "".join(str_parts)

# process a file
def process_file(path):
    global current_file_path
    current_file_path = path
    with open(path) as f:
        # open tmp file
        tmp_path = path + ".tmp"
        f_out = open(tmp_path, "w")

        global is_first_key_in_file
        is_first_key_in_file = True
        for l in f:
            l_out = process_line(l)
            f_out.write(l_out)
        f_out.close()
        os.rename(tmp_path, path)

# process a directory
def process_dir(path):
    for dirpath, dirnames, filenames in os.walk(path):
        for fname in filenames:
            fext = os.path.splitext(fname)[1]
            if fext != '' and fext in FILE_EXTENSIONS.split(','):
                fpath = os.path.join(dirpath, fname)
                process_file(fpath)

def process_path(path):
    if os.path.exists(path):
        if(os.path.isdir(path)):
            process_dir(path)
        else:
            process_file(path)

# main
##################################################
import sys, os, re

properties = {}
current_file_path = ''

for path in sys.argv[1:]:
    process_path(path)