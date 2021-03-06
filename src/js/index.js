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
Array.prototype.contains = function(obj) { return this.indexOf(obj) > -1 }
const formInputs = [...queryTargetAll('input'), queryTarget('textarea')]

document.addEventListener("DOMContentLoaded", e => {
	tools.setDOMContentLoadedTimeStamp(e)
	menu = new Menu()
	menu.toggleNavbarTransparency()
	announce.events()
	lazyload.load()
})

document.addEventListener("click", e => { 
	const id = targetId(e)

	targetId(e) === 'btnMenu' ? menu.toggle() : menu.close()

	if(id === 'nav-1') scroll.scrollToTop()

	if(['thumbnail-1', 'nav-2', 'parallax-1'].contains(id)) scroll.scrollToParameter('.article-1')

	if(['thumbnail-2', 'nav-3'].contains(id)) scroll.scrollToParameter('.article-2')

	if(['thumbnail-3', 'nav-4'].contains(id)) scroll.scrollToParameter('.article-3')

	if(['nav-5', 'parallax-2'].contains(id)) scroll.scrollToParameter('.form')

	if(id === 'logo') scroll.scrollToTop()

	if(id === 'article') page.toggleArticle(e)

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
		if(scroll.getPositionY() >= 400) menu.toggleNavbarVisiblity(e)
		if(scroll.getPositionY() >= 10) menu.removeNavbarTransparent()
		if(!validate.isWidthMobile() ? scroll.getPositionY() < 50 : scroll.getPositionY() <= 10) {
			menu.addNavbarVisible()
			menu.toggleNavbarTransparency()
		}
	}, 20)
)
window.addEventListener("resize", () => {
	if(!validate.isWidthMobile()) tools.throttle(menu.close(), 20)
	menu.toggleNavbarTransparency()
	lazyload.load()
	menu.removeNavbarTransparent()
})
window.addEventListener("orientationChange", () => {
	menu.toggleNavbarTransparency()
	lazyload.load()
})
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