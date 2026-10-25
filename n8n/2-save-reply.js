// NODE 2 - put this Code node right AFTER the HTTP Request to Ollama (mode: Run Once for All Items)
// Saves the exchange to memory and returns { output } for the chat widget.
const res = $input.first().json;
let reply = String((res.message && res.message.content) || res.response || res.output || '').trim();
if (!reply) reply = 'Sorry, I could not answer that. Please call admissions on 7995574332.';
const prep = $('Prepare Prompt').first().json;
if (prep.warm) return [{ json: { output: '' } }];   // warm-up call: don't store it
const sd = $getWorkflowStaticData('global');
sd.fastHist = sd.fastHist || {};
const h = sd.fastHist[prep.sessionId] || [];
h.push({ role: 'user', content: prep.userText.slice(0, 300) }, { role: 'assistant', content: reply.slice(0, 300) });
delete sd.fastHist[prep.sessionId];
sd.fastHist[prep.sessionId] = h.slice(-6);
const ids = Object.keys(sd.fastHist);
if (ids.length > 200) ids.slice(0, ids.length - 200).forEach(i => delete sd.fastHist[i]);
return [{ json: { output: reply } }];
