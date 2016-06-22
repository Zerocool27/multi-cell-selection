# multi-cell-selection
Multiple Table Cell Selection allows you to select one or more cells in a table. Since this feature is asked and searched on the Internet frequently,
this directive will solve your problem.

<h1>Installing</h1>
```console
bower install multi-cell-select --save
```
<h1>Usage</h1>
*Your angular_view.html*
```html
	<table ng-table="exampleTable" multi-cell-select multi-cell-ids="ids">
	        <!-- Your table design here -->
	</table>
```
*Your Controller.js*
```javascript

    $scope.ids = []; // Result of selected cells will be stored here

```
The directive stores the selected cell ids in the array "multi-cell-ids". You should assign it to another variable to access it
in your controller. 
 
 You can find working example here: <url>https://jsfiddle.net/Zerocool27/dg98mc9u/16/</url>
