import ScreenState from './includes/ScreenState'
import Menu from './includes/Menu'
import Form from './includes/Form'
import Page from './includes/Page'
import Server from './includes/Server'
import Lazyload from './includes/Lazyload'
import {targetId, parentId, queryTarget, queryTargetAll} from './includes/helpers'

const server = new Server()
const screenState = new ScreenState()
const page = new Page()
const menu = new Menu()
const form = new Form()
const lazyload = new Lazyload()




document.addEventListener("DOMContentLoaded", () => {
	page.announceApproachingEvents()
	document.addEventListener("scroll", lazyload.lazyload)
	window.addEventListener("resize", lazyload.lazyload)
	window.addEventListener("orientationChange", lazyload.lazyload)
	const inputs = [...queryTargetAll('input'), queryTarget('textarea')]
	inputs.map(input => input.addEventListener("focus", e => form.toggleInputFocus(e)))
	inputs.map(input => input.addEventListener("blur", e => {
		form.toggleInputFocus(e)
		form.removeClassSuccessIfInputEmpty(e)
	}))
})
document.addEventListener("click", e => { 
	const id = targetId(e) 

	parentId(e) === 'btnMenu' ? menu.toggleMenu() : menu.closeMenu()

	if(id === 'form-status') page.removeInnerOf('#form-status')

	if(id === 'parallax-circle') screenState.scrollToParameter('.thumbnail-container')

	if(id === 'nav-1') screenState.scrollToTop()

	if(id === 'thumbnail-1' || id === 'nav-2' || id === 'btn-parallax-1') screenState.scrollToParameter('.article-1')

	if(id === 'thumbnail-2' || id === 'nav-3') screenState.scrollToParameter('.article-2')

	if(id === 'thumbnail-3' || id === 'nav-4') screenState.scrollToParameter('.article-3')

	if(id === 'nav-5' || id === 'btn-parallax-2') screenState.scrollToBottom()

	if(id === 'icon') screenState.scrollToTop()

	if(id ==='article') page.toggleArticle(e)
})
queryTarget("#form").addEventListener("submit", e => {
	e.preventDefault()
	form.requestMailing(e)
})
queryTarget("#form").addEventListener("input", e => { if(targetId(e) === "message") page.resizeTextareaToFitContent(e) })
