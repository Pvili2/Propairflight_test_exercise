import re
import os

print(os.path.dirname(__file__))
os.chdir(os.path.dirname(__file__))

def remove_path_move_ups(path):
    move_up_count = len(re.findall(r'\.\.\/', path))
    path = re.sub(r'\.\.\/', '', path)
    return path, move_up_count


def merge_paths(parent, child):
    truncated_child, move_up_count = remove_path_move_ups(child)
    truncated_parent = parent
    if move_up_count:
        truncated_parent = '/'.join(parent.split('/')[:-move_up_count])
    truncated_parent =re.sub(r'\.\/','', truncated_parent)
    return truncated_parent + '/' + truncated_child


with open('pf-test-instrument.html', 'r') as f1, open('pf-test-instrument_msfs.html', 'w') as f2:
    copy_css = False
    copy_body = False
    copy_js = False
    js_path = ""

    for line in f1:
        if '@css' in line:
            copy_css = not copy_css

        elif '@body' in line:
            copy_body = not copy_body
            if copy_body:
                body_id = ""
                body_id_found = re.search('id="(.*)"', line)
                if body_id_found:
                    body_id = body_id_found.group(1)
                f2.write('<script type="text/html" id="' + body_id + '">\n')
            else: 
                f2.write('</script>\n')

        elif '@js' in line:
            copy_js = not copy_js
            if copy_js:
                js_path_found = re.search('path="(.*)"', line)
                if js_path_found:
                    js_path = js_path_found.group(1)

        elif copy_css or copy_body:
            f2.write(line)

        elif copy_js:
            src_found = re.search('src="(.*)"', line)
            if src_found:
                src_path = merge_paths(js_path, src_found.group(1))
                f2.write('<script type="text/html" import-script="' + src_path + '">')
            if '</script>' in line:
                f2.write('</script>\n')