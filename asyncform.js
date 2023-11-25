/* 
                              __                         _     
   __ _ ___ _   _ _ __   ___ / _| ___  _ __ _ __ ___    (_)___ 
  / _` / __| | | | '_ \ / __| |_ / _ \| '__| '_ ` _ \   | / __|
 | (_| \__ \ |_| | | | | (__|  _| (_) | |  | | | | | |_ | \__ \
  \__,_|___/\__, |_| |_|\___|_|  \___/|_|  |_| |_| |_(_)/ |___/
  qzip      |___/                                     |__/      v1.0.1
_______________________________________________________________________
    a simple way of doing forms without refreshing your page!
        this works in the literal same way a form does.
*/
document.addEventListener('submit', async function (event) {
  const form = event.target;
    if(form.getAttribute('type').toLowerCase() == "asyncform") {
      event.preventDefault();
      event.stopPropagation();
    } else {
      return;
    }

    const method = (form.getAttribute('method')).toUpperCase() || 'GET';
    const action = form.getAttribute('action');
    const headers =  JSON.parse(form.getAttribute('headers') || "{}") || {};
    const responsehtml = form.getAttribute('responsehtml') || null;
    const responsejs = form.getAttribute('responsejs') || null;

    const formdata = new FormData(form);
    const url = new URL(action, window.location.origin);

    let response;

    if (method === 'GET') {
        for (const [key, value] of formdata.entries()) {
            url.searchParams.append(key, value);
        }
    }

    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    try {
      response = await fetch(url, {
        method,
        body: method !== 'GET' ? formdata : undefined,
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(url + ` response was ${response.status}`);
      }

      const responsedata = await response.text();

      if (responsehtml) {
        const responseelem = document.querySelector(responsehtml);
        if (responseelem) {
          responseelem.innerHTML = responsedata;
        }
      }
      if (responsejs && window[responsejs]) {
        window[responsejs](responsedata);
      }
    } catch (error) {
      console.error('err:', error);
    }
});
