function Menu() {
	const navbar = queryTarget('nav')
	
	this.toggle = () => {
		navbar.classList.toggle('open')
		if(validate.isWidthMobile()) 
			validate.isMenuOpen() ? scroll.disableScroll() : scroll.enableScroll()
	}
	this.close = () => {
		scroll.enableScroll()
		if(!validate.isMenuOpen()) return
		navbar.classList.remove('open')
	}
	this.toggleNavbarVisiblity = e => {
		if(!validate.shouldNavbarVisibiltyToggle(e)) return
		let isScrollingUp = scroll.direction()
		console.log(isScrollingUp)
		this.close()
		isScrollingUp ? this.addNavbarVisible() : this.removeNavbarVisible()
	}
	this.toggleNavbarTransparency = () => {
		tools.getScreenHeight() <= 750 ? menu.removeNavbarTransparent() : menu.addNavbarTransparent()
	}
	this.addNavbarVisible = () => navbar.classList.add('visible')
	this.removeNavbarVisible = () => navbar.classList.remove('visible')
	this.addNavbarTransparent = () => navbar.classList.add('transparent')
	this.removeNavbarTransparent = () => navbar.classList.remove('transparent')
}
