angular.module('multi-cell-select', [])
	.directive('multiCellSelect', function($window, $document) {

		return {
			scope: {
				multiCellIds: '='
			},
			controller: function($scope, $element) {
				var clearFlag = false;
				var startCell = null;
				var dragging = false;
				var finalCell = null;

				function mouseDown(el) {
					dragging = true;
					setStartCell(el);
					setRangeArea(startCell, el)
				}

				function mouseUp(el) {
					dragging = false;
					finalCell = el;
					setSelectedCells(startCell, finalCell);
					if (clearFlag) {
						clearCells(startCell, finalCell);
						clearFlag = false;
					}
					startCell = null;
				}



				function mouseLeave(el) {
					if (dragging) {
						if (el.hasClass('hover-area')) {
							cellsBetween(startCell, el).each(function() {
								var el = angular.element(this);
								el.toggleClass('hover-area').addClass('ui-state-default')
							});
							if (startCell == el) {
								el.toggleClass('hover-area').addClass('ui-state-default')
							}
						}
					} else {
						return;
					}
				}

				function mouseEnter(el) {
					if (!dragging) {
						return;
					} else {
						setRangeArea(startCell, el);
					}
				}

				function setStartCell(el) {
					startCell = el;
				}



				function setRangeArea(start, el) {
					if (dragging) {
						if (el.hasClass('ui-state-default')) {
							cellsBetween(startCell, el).each(function() {
								var el = angular.element(this);
								el.addClass('hover-area')
							});
						} else if (el.hasClass('hover-area') || el.hasClass('ui-state-default')) {
							cellsBetween(startCell, el).each(function() {
								var el = angular.element(this);
								el.toggleClass('hover-area').addClass('ui-state-default');
							});
						}

						if (!start.hasClass('eng-selected-item')) {
							cellsBetween(startCell, el).each(function() {
								var el = angular.element(this);
								if (el.hasClass('eng-selected-item')) {
									clearFlag = true;
								}
							});
						}

					}
				}

				function setSelectedCells(start, end) {
					if (start && end) {
						cellsBetween(start, end).each(function() {
							var el = angular.element(this);
							if (el.hasClass('eng-selected-item') && el.hasClass('hover-area')) {
								el.removeClass('eng-selected-item');
								el.removeClass('hover-area')
								var id = el.attr('id');
								var index = $scope.multiCellIds.indexOf(id);
								if ($scope.multiCellIds.indexOf(el.attr('id')) > -1) {
									$scope.multiCellIds.splice(index, 1);
								}
							} else if (el.hasClass('hover-area') && !el.hasClass('eng-selected-item')) {
								el.addClass('eng-selected-item');
								el.removeClass('hover-area')

								if ($scope.multiCellIds.indexOf(el.attr('id')) == -1) {
									$scope.multiCellIds.push(el.attr('id'));
								}
							}
						});
					}
				}

				function clearCells(start, end) {
					cellsBetween(start, end).each(function() {
						var el = angular.element(this);
						el.removeClass('eng-selected-item');
						el.removeClass('hover-area');
						var id = el.attr('id');
						var index = $scope.multiCellIds.indexOf(id);
						if ($scope.multiCellIds.indexOf(el.attr('id')) > -1) {
							$scope.multiCellIds.splice(index, 1);
						}
					});


				}

				function cellsBetween(start, end) {
					var coordsStart = getCoords(start);
					var coordsEnd = getCoords(end);
					var topLeft = {
						column: $window.Math.min(coordsStart.column, coordsEnd.column),
						row: $window.Math.min(coordsStart.row, coordsEnd.row),
					};
					var bottomRight = {
						column: $window.Math.max(coordsStart.column, coordsEnd.column),
						row: $window.Math.max(coordsStart.row, coordsEnd.row),
					};
					return $element.find('td').filter(function() {
						var el = angular.element(this);
						var coords = getCoords(el);
						return coords.column >= topLeft.column && coords.column <= bottomRight.column && coords.row >= topLeft.row && coords.row <= bottomRight.row;
					});

				}



				function getCoords(cell) {
					var row = cell.parents('row');
					return {
						column: cell[0].cellIndex,
						row: cell.parent()[0].rowIndex
					};

				}

				function wrap(fn) {
					return function() {
						var el = angular.element(this);
						$scope.$apply(function() {
							fn(el);
						});
					}
				}


				$element.delegate('td', 'mousedown', wrap(mouseDown));
				$element.delegate('td', 'mouseenter', wrap(mouseEnter));
				$element.delegate('td', 'mouseleave', wrap(mouseLeave));
				$element.delegate('td', 'mouseup', wrap(mouseUp));

			}
		}
	});