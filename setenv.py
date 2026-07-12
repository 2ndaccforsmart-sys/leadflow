p = 'D:/Daksh/Business/LeadFlow/.env.local'
with open(p) as f:
    c = f.read()
c = c.replace('SEARCHX_API_KEY=***', 'SEARCHX_API_KEY=sk-sx-dc59dfbdfe665e7f9566c8e071e609b68c1d4c2e32b206b0')
with open(p, 'w') as f:
    f.write(c)
print('done')
