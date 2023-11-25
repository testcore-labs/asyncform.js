# asyncform.js
a simple way of doing forms, asynchronously.

note: responsejs has to be a global function like one you create yourself:
```js 
function test(responsedata) {
console.log("result " + responsedata);
}
```
example:
```html
<form type="asyncform" method="GET" action="/api/test" responsehtml="#element" responsejs="test">
  <input type="text" name="text" placeholder="inputone">
  <input type="text" name="tssext" placeholder="inputone">
  <input type="text" name="tsssssext" placeholder="inputone">
  <button type="submit">submit</button>
</form>
```

and thats it, enjoy.

also to directly include the js file into your html:
```html
<script src="https://cdn.jsdelivr.net/gh/testcore-labs/asyncform.js/asyncform.js"></script>
```
