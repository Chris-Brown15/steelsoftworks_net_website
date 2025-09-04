let REMOVE_REGEX = new RegExp('}' , 'g');

document.querySelectorAll('details').forEach(function(element) {

	//If the element was opened, remove the } from the summary. If it was closed, add it back.
	element.addEventListener('toggle' , function() {

		if(element.open) element.children[0].textContent = element.children[0].textContent.replace('}' , '');
		else element.children[0].textContent += '}';

	});

});
