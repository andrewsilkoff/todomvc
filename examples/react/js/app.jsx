/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';

	app.PRIORITY_NORMAL = 'normal';
	app.PRIORITY_MAJOR = 'major';
	app.PRIORITY_MINOR = 'minor';

	app.SORT_ABC_AZ = 'az';
	app.SORT_ABC_ZA = 'za';
	app.SORT_ABC_OFF = 'off';

	app.SORT_PRIORITY_HIGH_TO_LOW = 'high_to_low';
	app.SORT_PRIORITY_LOW_TO_HIGH = 'low_to_high';
	app.SORT_PRIORITY_OFF = 'off';

	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				sortABC: app.SORT_ABC_OFF,
				sortPriority: app.SORT_PRIORITY_OFF,
				editing: null,
				newTodo: '',
				newTodoPriority: app.PRIORITY_NORMAL
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		handlePriorityChange: function (event) {
			this.setState({newTodoPriority: event.target.value});
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				this.props.model.addTodo(val, this.state.newTodoPriority);
				this.setState({newTodo: ''});
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (todoToToggle) {
			this.props.model.toggle(todoToToggle);
		},

		destroy: function (todo) {
			this.props.model.destroy(todo);
		},

		edit: function (todo) {
			this.setState({editing: todo.id});
		},

		save: function (todoToSave, text) {
			this.props.model.save(todoToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		sortBy: function (type, value) {
			this.setState({sortABC: app.SORT_ABC_OFF, sortPriority: app.SORT_PRIORITY_OFF});
			this.setState({[type]: value});
		},

		render: function () {
			var footer;
			var main;
			var todos = this.props.model.todos;

			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
				}
			}, this);

			switch (this.state.sortABC) {
				case app.SORT_ABC_AZ:
					shownTodos = sortByABC(shownTodos);
					break;
				case app.SORT_ABC_ZA:
					shownTodos = sortByABC(shownTodos).reverse();
					break;
				default:
					break;
			}

			switch (this.state.sortPriority) {
				case app.SORT_PRIORITY_HIGH_TO_LOW:;
					shownTodos = sortByPriority(shownTodos);
					break;
				case app.SORT_PRIORITY_LOW_TO_HIGH:
					shownTodos = sortByPriority(shownTodos).reverse(shownTodos)
					break;
				default:
					break;
			}

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						sortABC={this.state.sortABC}
						sortPriority={this.state.sortPriority}
						onClearCompleted={this.clearCompleted}
						onSort={this.sortBy}
					/>;
			}

			if (todos.length) {
				main = (
					<section className="main">
						<input
							id="toggle-all"
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<label
							htmlFor="toggle-all"
						/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header className="header">
						<h1>todos</h1>
						<input
							className="new-todo"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
						<select value={this.state.newTodoPriority} onChange={this.handlePriorityChange}>
							<option value="normal">normal</option>
							<option value="major">major</option>
							<option value="minor">minor</option>
						</select>

					</header>
					{main}
					{footer}
				</div>
			);

			function sortByPriority(todos) {
				return todos.map(function(i) {
					switch(i.priority) {
						case "major":
							i.priorityWeight = 0;
							break;
						case "normal":
							i.priorityWeight = 1;
							break;
						case "minor":
							i.priorityWeight = 2;
							break;
						default:
							break;
					}
					return i;

				}).sort(function(a, b) {
					return a.priorityWeight - b.priorityWeight;
				});
			}

			function sortByABC (todos) {
				return todos.sort((a, b) => a.title.localeCompare(b.title))
			}

		}
	});

	var model = new app.TodoModel('react-todos');

	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
