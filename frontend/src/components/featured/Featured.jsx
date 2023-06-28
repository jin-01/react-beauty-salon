import "./featured.css"

function Featured() {
    return (
        <div className="featured">
            <div className="featuredItem">
                <img src="https://cf.bstatic.com/xdata/images/city/600x600/685535.jpg?k=e2be6eed1575001863411089bf79fd4be8a1d6fc4fb68ee5c865083994a6fe96&o=" alt="" className="featuredImg" />
                <div className="featuredTitles">
                    <h1>Kuala Lumpur</h1>
                    <h2>123 properties</h2>
                </div>
            </div>
            <div className="featuredItem">
                <img src="https://cf.bstatic.com/xdata/images/city/600x600/685594.jpg?k=2f9ce78678dc00afab76dc1bb1d27d11844e7dce759a43e1caf124f7bc21c236&o=" alt="" className="featuredImg" />
                <div className="featuredTitles">
                    <h1>Malacca</h1>
                    <h2>200 properties</h2>
                </div>
            </div>
            <div className="featuredItem">
                <img src="https://cf.bstatic.com/xdata/images/city/600x600/685537.jpg?k=834d87e44e578ae3f2890ca4781f625a160ffed4483589f5b060209327aebbf5&o=" alt="" className="featuredImg" />
                <div className="featuredTitles">
                    <h1>George Town</h1>
                    <h2>300 properties</h2>
                </div>
            </div>
        </div>
    )
}

export default Featured