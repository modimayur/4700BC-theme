document.addEventListener('DOMContentLoaded', function() {
	window.setTimeout(function() {
		document.querySelector('.vertical-accordion').style.opacity = '1';
	}, 2000);
	const divs = document.querySelectorAll('.vertical-accordion .vertical-accordion-iteam');
	divs.forEach(div => div.classList.add('default'));
	divs.forEach(div => {
		div.addEventListener('click', function() {
			const expandedDivs = document.querySelectorAll('.vertical-accordion > div.vertical-accordion-iteam.expand');
			if (expandedDivs.length > 0) {
				expandedDivs.forEach(expandedDiv => expandedDiv.classList.remove('expand'));
				this.classList.add('expand');
			} else {
				this.classList.add('expand');
			}
		});
	});
});