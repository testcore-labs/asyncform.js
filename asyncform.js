/* 
                              __                         _     
   __ _ ___ _   _ _ __   ___ / _| ___  _ __ _ __ ___    (_)___ 
  / _` / __| | | | '_ \ / __| |_ / _ \| '__| '_ ` _ \   | / __|
 | (_| \__ \ |_| | | | | (__|  _| (_) | |  | | | | | |_ | \__ \
  \__,_|___/\__, |_| |_|\___|_|  \___/|_|  |_| |_| |_(_)/ |___/
  qzip      |___/                                     |__/      v1.0.4
_______________________________________________________________________
    a simple way of doing forms without refreshing your page!
        this works in the literal same way a form does.
*/
document.addEventListener('submit', async function (event) {
  const form = event.target;
  const button = event.submitter;
    if(form.getAttribute('type').toLowerCase() == "asyncform") {
      event.preventDefault();
      event.stopPropagation();
    } else {
      return;
    }

    const method = (form.getAttribute('method')).toUpperCase() || 'GET';
    const action = form.getAttribute('action') || false;
    const btnaction = button.getAttribute('action') || false;
    const headers = JSON.parse(form.getAttribute('headers') || "{}") || {};
    const responsehtml = form.getAttribute('responsehtml') || null;
    const responsejs = form.getAttribute('responsejs') || null;

    const formdata = new FormData(form);
    let url;
    url = btnaction ? new URL(btnaction, window.location.origin) : new URL(action, window.location.origin);

    if(action == null) {
    return;
    }

    let response;

    if (method === 'GET') {
        for (const [key, value] of formdata.entries()) {
            url.searchParams.append(key, value);
        }
    }
    //useless, set it yourself with the attribute headers.
    //headers['Content-Type'] = 'application/x-www-form-urlencoded';
    form.setAttribute("requesting", true);
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

      form.setAttribute("requesting", false);
      if (responsehtml) {
        const responseelem = document.querySelector(responsehtml);
        if (responseelem) {
          responseelem.innerHTML = responsedata;
        }
      }
      if (responsejs && window[responsejs][responsedata]) {
        var match = /(\w+)\(['"]([^'"]*)['"]\)/.exec(responsejs.trim());
        if(!match) {
        window[responsejs][responsedata];
        } else {
        window[match[1]].apply(null, [responsedata].concat(match[2].split(',').map(arg => arg.trim())));
        }
      }
    } catch (error) {
      console.error('err:', error);
    }
});
