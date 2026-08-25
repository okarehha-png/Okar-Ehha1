import re

with open('src/data/services.ts', 'r') as f:
    content = f.read()

# We'll just define the object fully or just remove the ones we don't need.
# Since it's a TS file, we can do some regex, or we can just rewrite the whole file cleanly.
# Given the size, maybe rewriting via python script string parsing is easier.
