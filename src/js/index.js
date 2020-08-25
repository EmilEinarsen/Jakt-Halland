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
const formInputs = [...queryTargetAll('input'), queryTarget('textarea')]

document.addEventListener("DOMContentLoaded", e => {
	tools.setDOMContentLoadedTimeStamp(e)
	menu = new Menu()
	if(scroll.getPositionY() < 100) menu.addNavbarTransparent()
	announce.events()
	lazyload.load()
})

document.addEventListener("click", e => { 
	const id = targetId(e)

	targetId(e) === 'btnMenu' ? menu.toggle() : menu.close()

	if(id === 'parallax-circle') scroll.scrollToParameter('.thumbnail-container')

	if(id === 'nav-1') scroll.scrollToTop()

	if(id === 'thumbnail-1' || id === 'nav-2' || id === 'parallax-1' ) scroll.scrollToParameter('.article-1')

	if(id === 'thumbnail-2' || id === 'nav-3') scroll.scrollToParameter('.article-2')

	if(id === 'thumbnail-3' || id === 'nav-4') scroll.scrollToParameter('.article-3')

	if(id === 'nav-5' || id === 'parallax-2') scroll.scrollToParameter('.form')

	if(id === 'logo') scroll.scrollToTop()

	if(id ==='article') page.toggleArticle(e)

	tools.setLastClickTimeStamp(e)
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
		if(tools.timeBetweenLastClickAndScroll()>40 && scroll.getPositionY() >= 400) {
			menu.toggleNavbarVisiblity(e)
		}
		if(scroll.getPositionY() >= 10) menu.removeNavbarTransparent()
		if(!validate.isWidthMobile ? scroll.getPositionY() < 50 : scroll.getPositionY() <= 10) {
			menu.addNavbarVisible()
			menu.addNavbarTransparent()
		}
	}, 20)
)
window.addEventListener("resize", () => {
	if(!validate.isWidthMobile()) tools.throttle(menu.close(), 20)
	lazyload.load()
})
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