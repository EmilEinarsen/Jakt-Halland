function Menu() {
	const menuBtn = queryTarget('.navbar-toggle')
	const nav = queryTarget('.main-nav')
	const navbar = [queryTarget('nav'), queryTarget('.top-bar')]
	
	this.toggleMenu = () => {
		nav.classList.toggle('visible')
		if(validate.isWidthMobile()) 
			validate.isMenuVisible() ? scroll.disableScroll() : scroll.enableScroll()
		menuBtn.classList.toggle('open')
	}
	this.closeMenu = () => {
		scroll.enableScroll()
		if(!validate.isMenuVisible()) return
		nav.classList.remove('visible')
		menuBtn.classList.remove('open')
	}
	this.toggleNavbarVisiblity = e => {
		if(!validate.shouldNavbarVisibiltyToggle(e)) return
		let isScrollingUp = scroll.direction()
		this.closeMenu()
		isScrollingUp ? this.addNavbarVisible() : this.removeNavbarVisible()
	}
	this.removeNavbarVisible = () => navbar.map(e => e.classList.remove('visible'))
	this.addNavbarVisible = () => navbar.map(e => e.classList.add('visible'))
}
