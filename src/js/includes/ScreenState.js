import {queryTarget, body} from './helpers'

export default function ScreenState() {
	this.disableScroll = () => {
		page.addPositionYToBody()
		queryTarget('body').classList.add('stop-scrolling')
	}

	this.enableScroll = () => {
		if(!isScrollingDisabled()) return
		queryTarget('body').classList.remove('stop-scrolling')
		this.scrollToInstantly({top: tools.stringToInt(body().style.top) * -1})
		page.removePositionYFromBody()
	}

	this.scrollToParameter = (param) => {
		const yOffset = -120
		const y = queryTarget(param).getBoundingClientRect().top + window.pageYOffset + yOffset
		window.scrollTo({top: y, behavior: 'smooth'})
	}

	this.isInWindow = param => param.offsetTop < (window.innerHeight + window.pageYOffset)
	this.scrollToTop = () => window.scrollTo({top: 0, behavior: 'smooth'})
	this.scrollToBottom = () => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
	this.scrollToInstantly = param => window.scrollTo(param)
	this.isWidthMobile = () => getScreenWidth() < 880
	const getScreenWidth = () => screen.width
	const isScrollingDisabled = () => queryTarget('body').classList.contains('stop-scrolling')
}