import re

with open('src/main/webapp/views/stack.html', 'r', encoding='utf-8') as f:
    stack_html = f.read()

with open('src/main/webapp/views/lider-proyecto.html', 'r', encoding='utf-8') as f:
    lider_html = f.read()

# Extract tech categories from stack.html
start_idx = stack_html.find('<div class="tech-category">')
end_idx = stack_html.find('<div class="action-footer">')
stack_section = stack_html[start_idx:end_idx].strip()

# Replace trailing div from cards-grid if included
if stack_section.endswith('</div>'):
    stack_section = stack_section[:-6].strip()

# Change class="tech-tag" to type="button" class="stack-tag"
stack_section = stack_section.replace('class="tech-tag"', 'type="button" class="stack-tag"')

# Now insert into lider-proyecto.html
# We find the start of the first <div class="tech-category"> in lider-proyecto.html
lider_start = lider_html.find('<div class="tech-category">')

# We find the end where <input type="hidden" name="stack" id="stack-hidden" required> is
lider_end = lider_html.find('<input type="hidden" name="stack" id="stack-hidden" required>')

if lider_start != -1 and lider_end != -1:
    final_html = lider_html[:lider_start] + stack_section + '\n  ' + lider_html[lider_end:]
    with open('src/main/webapp/views/lider-proyecto.html', 'w', encoding='utf-8') as f:
        f.write(final_html)
    print("Success")
else:
    print("Failed")
