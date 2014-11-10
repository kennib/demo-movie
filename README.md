# Demo Movie

Use this package to record movies of a website.

## Example
~~~javascript
	demoMovie()
~~~

## Reference
### `demoMovie(url, actions)`
 * `url` is the url to visit in the web browser
 * `actions` is a function which performs browser actions and
    will be called at the appropriate time for recording.
 * returns `stream` a stream which can be output to a file
