window.addEventListener('load', function() {

	event.preventDefault();

	const modal = document.getElementById('modal');
	const modalOpen = document.getElementById('open');
	const modalClose = document.getElementById('close');
	const submit = document.getElementById('submit');

	const getUsers = function(users) {
		const container = document.getElementById('container');
		users.forEach((user) => {
			const div = document.createElement('div');
			div.className = 'card';

			const img = document.createElement('img');
			img.src = user.gender === "male" ? "img_avatar.png" : "img_avatar2.png";

			const childDiv = document.createElement('div');
			childDiv.className = 'container';

			const h2 = document.createElement('h2');
			h2.textContent = user.name;

			const p = document.createElement('p');
			p.textContent = user.jobType;

			const btnDelete = document.createElement('button');
			btnDelete.textContent = 'X';
			btnDelete.className	= 'delete';
			btnDelete.setAttribute('data-id', user.id);

			const btnEdit = document.createElement('button');
			btnEdit.textContent = 'E';
			btnEdit.className	= 'edit';
			btnEdit.setAttribute('data-id', user.id);

			div.appendChild(btnDelete);
			div.appendChild(btnEdit);
			div.appendChild(img);
			div.appendChild(childDiv);
			childDiv.appendChild(h2);
			childDiv.appendChild(p);
			container.appendChild(div);
		});
	};

	modalOpen.onclick = function() {
		submit.className = 'post';
		modal.style.display = "block";
	};

	modalClose.onclick = function() {
		modal.style.display = "none";
		submit.classList.remove('put' || 'post');
	};

	window.onclick = function() {
		if(event.target == modal) {
			modal.style.display = "none";
			submit.classList.remove('put' || 'post');
		};
	};

	fetch('http://localhost:3000/users')
		.then((response) => response.json())
		.then((users) => getUsers(users));

	
	document.getElementById('container').addEventListener('click', function(event) {
		event.preventDefault();
		//event.target //источник события
		//event.currentTarget // елемент на который навешан обработчик
		if(event.target.className === 'delete') {
			const userId = event.target.getAttribute('data-id');
			fetch(`http://localhost:3000/users/${userId}`, {
				method: 'DELETE'
			}).then(() => {
				const user = event.target.parentElement;
				document.getElementById('container').removeChild(user);
			});
		};

	});

	document.getElementById('form').addEventListener('submit', function(event) {
		event.preventDefault();
		if(submit.className === 'post') {
			fetch('http://localhost:3000/users', {
				method: 'POST',
				body: JSON.stringify({
					name: document.getElementById('name'),
					gender: document.querySelector('input[name="gender"]:checked').value,
					jobType: document.getElementById('jobType')
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response) => response.json())
			.then((users) => getUsers(users));
			modal.style.display = "none";
			submit.classList.remove('post');
		};
	});



	document.getElementById('container').addEventListener('click', function(event) {
		event.preventDefault();
		if(event.target.className === 'edit') {
			const userId = event.target.getAttribute('data-id');
			const form = document.getElementById('form');
			form.setAttribute('data-id', userId);

			submit.className = 'put';
			modal.style.display = "block";

			fetch('http://localhost:3000/users/${userId}')
				.then((response) => response.json())
				.then((user) => {
					document.getElementById('name').textContent = user.name;
					document.getElementById('jobType').textContent = user.jobType;
					user.gender === "male" ? document.querySelector('input[value="male"]').checked = true : document.querySelector('input[value="female"]').checked = true
				});
		};
	});

	document.getElementById('form').addEventListener('submit', function(event) {
		event.preventDefault();
		if(submit.className === 'put') {
			const userId = event.target.getAttribute('data-id');
			console.log(userId);
			fetch('http://localhost:3000/users', {
				method: 'PUT',
				body: JSON.stringify({
					name: document.getElementById('name'),
					gender: document.querySelector('input[name="gender"]:checked').value,
					jobType: document.getElementById('jobType')
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response) => response.json())
			.then((users) => getUsers(users));
			modal.style.display = "none";
			submit.classList.remove("put");
			event.target.removeAttribute('data-id');
			event.target.reset();
		};
	});

});
