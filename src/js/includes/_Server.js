function Server() {
	this.data

	this.fetch = async () => {
		if(this.data) return
		try {
			const [events] = await Promise.all([
				(await fetch("https://wordpress.jakthalland.se/wp-json/wp/v2/events")).json(),
			])
			sort.sortData(events)
		} catch (err) {
			tools.throttle(this.fetch, 5000)
		  	console.log(err)
		}
	}
	this.getEvents = async() => {
		await this.fetch()
		return sort.sortDataByEvent()
	}
}