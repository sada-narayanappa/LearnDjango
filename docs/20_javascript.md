# Javascript utils 

## Most used 'CallWS' Function Documentation

**Overview**
------------

The `callws` function is an asynchronous worker that sends a POST request to a specified URL with a form data payload. It provides various options for customization and logging.

**Function Signature**
---------------------

```javascript
async function callws(
  url: string = '/ui/test/',
  formName: string = '',
  callbacks?: any,
  context: object = {},
  opts = callws_default_opts
)
```

**Parameters**
---------------

*   **url** (string): The URL to send the request to. Defaults to `/ui/test/`.
*   **formName** (string): The name of the form data payload.
*   **callbacks** (any): An optional array or function that will be called with the response data. Can be an empty array or object.
*   **context** (object): An optional object that will be passed to the `callbacks` function.
*   **opts** (object): An optional options object that can override default settings.

**Default Options**
------------------

The `callws_default_opts` object is used as the base for any custom options provided. The available default options are:

*   `url`: `/ui/test/`
*   `formName`: empty string
*   `callbacks`: empty array or function
*   `context`: empty object
*   `getIDS`: false

**Return Value**
-----------------

The function returns the response object from the server.

**Behavior**
-------------

1.  It initializes a start time and checks for any custom options being provided.
2.  If options are provided, it updates the default values with the custom settings.
3.  It retrieves the form data using `callws_getform`.
4.  It calls `busy()` to indicate that the function is busy.
5.  If logging is enabled (`opts.log`), it dumps the form data.
6.  It sends a POST request to the specified URL with the form data payload.
7.  It handles the response and updates any callbacks or logging variables as necessary.
8.  Finally, it returns the response object.

**Example Usage**
-----------------

```javascript
// Simple call with default settings
callws('/api/data', 'myForm', [], { foo: 'bar' })

// Call with custom options
callws({
  url: '/new/api/data',
  formName: 'myNewForm',
  callbacks: ['func1', 'func2