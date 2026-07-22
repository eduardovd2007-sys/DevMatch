import re

with open('src/main/webapp/views/stack.html', 'r', encoding='utf-8') as f:
    stack_html = f.read()

# Extract from the first <div class="tech-category"> up to the end of the last category
start_marker = '<div class="tech-category">'
start_idx = stack_html.find(start_marker)
end_marker = '</div>\n\n            <!-- Banner Informativo -->'
end_idx = stack_html.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find boundaries in stack.html")
    exit(1)

# Extract only the categories
categories_html = stack_html[start_idx:end_idx]

# Replace class="tech-tag" with type="button" class="stack-tag"
categories_html = categories_html.replace('class="tech-tag"', 'type="button" class="stack-tag"')

with open('src/main/webapp/views/lider-proyecto.html', 'r', encoding='utf-8') as f:
    lider_html = f.read()

# In lider-proyecto.html, find the exact stack-picker start and end
lider_start_marker = '<div class="stack-picker" id="stack-picker">'
lider_end_marker = '<input type="hidden" name="stack" id="stack-hidden" required>'

l_start_idx = lider_html.find(lider_start_marker)
l_end_idx = lider_html.find(lider_end_marker)

if l_start_idx == -1 or l_end_idx == -1:
    print("Could not find boundaries in lider-proyecto.html")
    exit(1)

# Construct final HTML
# Everything before stack-picker + stack-picker tag + NEW CONTENT + closing div and everything after
final_html = lider_html[:l_start_idx + len(lider_start_marker)] + '\n' + categories_html + '  </div>\n    ' + lider_html[l_end_idx:]

with open('src/main/webapp/views/lider-proyecto.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Successfully safely updated lider-proyecto.html!")
