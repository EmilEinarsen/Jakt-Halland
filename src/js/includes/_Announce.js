function Announce() {
	this.events = async() => {
		const events = await server.getEvents()
		let [AbdIntensive, AbdLeader, AbdCalm] = tools.structureApprouchingEvents(events, true)
		let [intensive, leader, calm] = tools.structureApprouchingEvents(events)
		let eventsString = `Nästa kurstillfällen: `

		if(intensive) {
			page.addInnerOf('#intensiveEventDates', `Nästa kurstillfälle är den ${intensive}.<br><br>`)
			eventsString = `${eventsString} Intensiv Jägarexamen, den ${AbdIntensive}.`
		} else page.hideMe('#intensiveEventDates')
		
		if(calm) {
			page.addInnerOf('#calmEventDates', `Nästa kurstillfälle är den ${calm}.<br><br>`)
			eventsString = `${eventsString} Lugn Jägarexamen, den ${AbdCalm}.`
		} else page.hideMe('#calmEventDates')

		if(leader) {
			page.addInnerOf('#leadershipEventDates', `Nästa kurstillfälle är den ${leader}.<br><br>`)
			eventsString = `${eventsString} Jaktledarutbildning, den ${AbdLeader}.`
		} else page.hideMe('#leadershipEventDates')

		eventsString = eventsString + '<span><br>(Alla kurser hålls i laholmskomun)</span>'

		if(!(intensive && leader)) page.hideParent('#parallaxInfo')
		else page.addInnerOf('#parallaxInfo', eventsString)
	}
	this.formSubmissionSuccess = () => {
		page.addButtonSuccess()
		form.reset()
		tools.throttle(() => {
			page.removeSuccess()
			page.resetTextareaHeight()
		}, 3000)
	}
}