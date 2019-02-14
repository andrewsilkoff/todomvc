/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	app.TodoFooter = React.createClass({
		handleSortChange: function (type, value) {
			this.props.onSort(type, value)
		},
		render: function () {
			var activeTodoWord = app.Utils.pluralize(this.props.count, 'item');
			var clearButton = null;

			if (this.props.completedCount > 0) {
				clearButton = (
					<button
						className="clear-completed"
						onClick={this.props.onClearCompleted}>
						Clear completed
					</button>
				);
			}

			var nowShowing = this.props.nowShowing;
			var sortABC = this.props.sortABC;
			var sortPriority = this.props.sortPriority;
			return (
				<footer className="footer">
					<span className="todo-count">
						<strong>{this.props.count}</strong> {activeTodoWord} left
					</span>
					<ul className="filters">
						<li>
							<a
								href="#/"
								className={classNames({selected: nowShowing === app.ALL_TODOS})}>
									All
							</a>
						</li>
						{' '}
						<li>
							<a
								href="#/active"
								className={classNames({selected: nowShowing === app.ACTIVE_TODOS})}>
									Active
							</a>
						</li>
						{' '}
						<li>
							<a
								href="#/completed"
								className={classNames({selected: nowShowing === app.COMPLETED_TODOS})}>
									Completed
							</a>
						</li>
					</ul>

					<ul className="filters filters-priority">
						<li>
							<a
								onClick={this.handleSortChange.bind(this, 'sortPriority', app.SORT_PRIORITY_OFF)}
								className={classNames({selected: sortPriority === app.SORT_PRIORITY_OFF})}>
								-
							</a>
						</li>
						{' '}
						<li>
							<a
								onClick={this.handleSortChange.bind(this, 'sortPriority', app.SORT_PRIORITY_HIGH_TO_LOW)}
								className={classNames({selected: sortPriority === app.SORT_PRIORITY_HIGH_TO_LOW})}>
								high to low
							</a>
						</li>
						{' '}
						<li>
							<a
								onClick={this.handleSortChange.bind(this, 'sortPriority', app.SORT_PRIORITY_LOW_TO_HIGH)}
								className={classNames({selected: sortPriority === app.SORT_PRIORITY_LOW_TO_HIGH})}>
								low to high
							</a>
						</li>
					</ul>

					<ul className="filters filters-ABC">
						<li>
							<a
								onClick={this.handleSortChange.bind(this, 'sortABC', app.SORT_ABC_OFF)}
								className={classNames({selected: sortABC === app.SORT_ABC_OFF})}>
								-
							</a>
						</li>
						{' '}
						<li>
							<a
								onClick={this.handleSortChange.bind(this, 'sortABC', app.SORT_ABC_AZ)}
								className={classNames({selected: sortABC === app.SORT_ABC_AZ})}>
								A to Z
							</a>
						</li>
						{' '}
						<li>
							<a
								onClick={this.handleSortChange.bind(this, 'sortABC', app.SORT_ABC_ZA)}
								className={classNames({selected: sortABC === app.SORT_ABC_ZA})}>
								Z to A
							</a>
						</li>
					</ul>
				</footer>
			);
		}
	});
})();
