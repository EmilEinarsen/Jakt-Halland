import {queryTarget} from './helpers'

export default function Menu() {
	const isMenuVisible = () => queryTarget('.main-nav').classList.contains('visible')
	
	this.closeMenu = () => {
		screenState.enableScroll()
		if(!isMenuVisible()) return
		hideMenu()
		resetMenuButton()
	}
	this.toggleMenu = () => {
		toggleMenuVisibilty()
		if(screenState.isWidthMobile()) toggleScroll()
		toggleMenuButton()
	}
	
	const toggleMenuVisibilty = () => queryTarget('.main-nav').classList.toggle('visible')
	const hideMenu = () => queryTarget('.main-nav').classList.remove('visible')

	const toggleMenuButton = () => queryTarget('.navbar-toggle').classList.toggle('open')
	const resetMenuButton = () => queryTarget('.navbar-toggle').classList.remove('open')
	
	const toggleScroll = () => {
		if(isMenuVisible()) screenState.disableScroll()
		else screenState.enableScroll()
	}
}