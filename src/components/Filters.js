import Link from "next/link";
import styles from "./Filters.module.css";

export default function Filters ({titles, title, search}) {
    
    return (
        <form className={styles.filterContainer} method="GET" action="/">
            <div className="select-filter">
                <label htmlFor="select">Select a title:</label>
                <select id="select" defaultValue={title} name="title">
                <option value="">All</option>
                {
                    titles.map(function mapTitle(titleItem) {
                        return <option key={titleItem} value={titleItem}>{titleItem}</option>
                    })
                }
                </select>
            </div>
            <div className="search-filter">
                <label htmlFor="search">Search by name:</label>
                <input id="search" defaultValue={search} name="search" />
            </div>
            <button  type="submit">Apply Filters</button>
            <Link href="/">Clear Filters</Link>
        </form>
    )
}

