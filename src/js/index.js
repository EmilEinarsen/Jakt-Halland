const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
const body = () => document.body
const tools = new Tools()
const validate = new Validate()
const announce = new Announce()
const sort = new Sort()
const scroll = new Scroll()
let menu
const page = new Page()
const date = new Date()
const server = new Server()
const form = new Form()
const lazyload = new Lazyload()
const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", 
"Juli", "Augusti", "September", "Oktober", "November", "December"]
const formInputs = [...queryTargetAll('input'), queryTarget('textarea')]

document.addEventListener("DOMContentLoaded", e => {
	tools.setDOMContentLoadedTimeStamp(e)
	menu = new Menu()
	announce.events()
	lazyload.load()
})

document.addEventListener("click", e => { 
	const id = targetId(e)
	tools.setLastClickTimeStamp(e)

	parentId(e) === 'btnMenu' ? menu.toggleMenu() : menu.closeMenu()

	if(id === 'parallax-circle') scroll.scrollToParameter('.thumbnail-container')

	if(id === 'nav-1') scroll.scrollToTop()

	if(id === 'thumbnail-1' || id === 'nav-2' || id === 'btn-parallax-1') scroll.scrollToParameter('.article-1')

	if(id === 'thumbnail-2' || id === 'nav-3') scroll.scrollToParameter('.article-2')

	if(id === 'thumbnail-3' || id === 'nav-4') scroll.scrollToParameter('.article-3')

	if(id === 'nav-5' || id === 'btn-parallax-2') scroll.scrollToParameter('.form')

	if(id === 'icon') scroll.scrollToTop()

	if(id ==='article') page.toggleArticle(e)
})
queryTarget("#form").addEventListener("submit", e => {
	e.preventDefault()
	if(validate.isFormAnnouncingError()) return page.removeButtonError()
	if(validate.isFormAnnouncingSuccess()) {
		page.removeSuccess()
		page.resetTextareaHeight()
		tools.cancelThrottle()
	} else form.requestMailing(e)
})
queryTarget("#form").addEventListener("input", e => { 
	if(targetId(e) === "message") page.resizeTextareaToFitContent(e)
	validate.isFormValid(e) 
})
window.addEventListener("scroll", e => tools.throttle(function() {
		lazyload.load()
		tools.setLastScrollTimeStamp(e)
		if(tools.timeBetweenLastClickAndScroll()>30) menu.toggleNavbarVisiblity(e)
		if(scroll.getPositionY() < 40) menu.addNavbarVisible()
	}, 20)
)
window.addEventListener("resize", lazyload.load)
window.addEventListener("orientationChange", lazyload.load)
formInputs.map(input => input.addEventListener("focus", e => {
    page.removeButtonError()
    page.toggleInputFocus(e)
}))
formInputs.map(input => input.addEventListener("blur", e => {
	const id = targetId(e)
    if(!e.target.value) page.toggleInputFocus(e)
    validate.isInputValid(e.target.value, id) ? page.inputSuccess(id): page.removeSuccess(id)
	if(!e.target.value) page.resizeTextareaToFitContent
}))