import {queryTarget, body} from './helpers'
import Server from './Server'
import Tools from './Tools'

const server = Server()
const tools = new Tools()

export default function Page() {

	this.removePreloader = () => {
		queryTarget('.loader_bg').classList.add('hidden')
		/* setTimeout(() => this.removeOuterOf('.loader_bg'), 500) */
	}
	this.addPositionYToBody = () => body().style.top = `-${window.scrollY}`
	this.removePositionYFromBody = () => body().style.top = ''
	this.addInnerOf = (param, content) => {
		queryTarget(param).innerHTML = content
	}
	this.removeInnerOf = param => {
		queryTarget(param).innerHTML = ''
	}
	this.removeOuterOf = param => {
		queryTarget(param).outerHTML = ''
	}
	this.toggleArticle = e => {
		e.target.nextElementSibling.classList.toggle("closed")
		e.target.children[0].classList.toggle("open")
	}
	this.resizeTextareaToFitContent = () => {
		const keepPositionYOnResize = () => {
			this.addPositionYToBody()
			resizeTextarea()
			screenState.scrollToInstantly({top: tools.stringToInt(body().style.top) * -1})
			this.removePositionYFromBody()
		}
		const resizeTextarea = () => {
			queryTarget('#message').style.height = ''
			queryTarget('#message').style.height = queryTarget('#message').scrollHeight+'px'
		}
		tools.throttle(keepPositionYOnResize)
	}
	this.announceApproachingEvents = () => {
		server.fetch().then(()=>{
			let [hunter, leader] = server.getEventsByEvent()
			hunter = ifNeededConcatDateStrings(hunter)
			leader = tools.produceDateString(leader[0])
			this.addInnerOf('#navbarInfo', `Nästa kurstillfällen: Intensiv Jägarexamen, den ${hunter}. Jaktledarutbildning, den ${leader}.`)
			this.addInnerOf('#intensiveEventDates', `Nästa kurstillfälle är den ${hunter}.`)
			this.addInnerOf('#leadershipEventDates', `Nästa kurstillfälle är den ${leader}.`)
		})
		const ifNeededConcatDateStrings = events => {
			if(events.length === 1) return tools.produceDateString(events[0])
			return `${tools.produceDateString(events[0])} och ${tools.produceDateString(events[1])}`
		}
	}
}