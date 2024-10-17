interface Props {
    handlePreviousPage: () => void,
    handleNextPage: () => void,
    currentPage: number,
    goToPage: (arg0: number) => void,
    totalPages: number
}

const Pagination: React.FC<Props> = ({handlePreviousPage, handleNextPage, currentPage, goToPage, totalPages}) => {
    
    return (
        <div className="flex gap-x-5">
            <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="text-offWhite hover:text-lightTeal hover:cursor-pointer"
                aria-label="Previous Page"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>


            </button>

            {/* First Page */}
            {currentPage > 2 && (
                <button
                    onClick={() => goToPage(1)}
                    className="font-display text-offWhite px-2 py-1 rounded-md inner-border"
                    aria-label="Page 1"
                >
                    1
                </button>
            )}

            {/* Ellipsis before current page */}
            {currentPage > 3 && <span className="text-offWhite">...</span>}

            {/* Previous Pages */}
            {currentPage > 1 && (
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    className="font-display text-offWhite px-2 py-1 rounded-md inner-border"
                    aria-label={`Page ${currentPage - 1}`}
                >
                    {currentPage - 1}
                </button>
            )}

            {/* Current Page */}
            <span className="font-display text-offWhite px-2 py-1 rounded-md bg-darkTeal border border-transparent">
                {currentPage}
            </span>

            {/* Next Pages */}
            {currentPage < totalPages && (
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="font-display text-offWhite px-2 py-1 rounded-md inner-border"
                    aria-label={`Page ${currentPage + 1}`}
                >
                    {currentPage + 1}
                </button>
            )}

            {/* Ellipsis after current page */}
            {currentPage < totalPages - 2 && <span className="text-offWhite">...</span>}

            {/* Last Page */}
            {currentPage < totalPages - 1 && (
                <button
                    onClick={() => goToPage(totalPages)}
                    className="font-display text-offWhite px-2 py-1 rounded-md inner-border"
                    aria-label={`Page ${totalPages}`}
                >
                    {totalPages}
                </button>
            )}

            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="text-offWhite hover:cursor-pointer hover:text-lightTeal"
                aria-label="Next Page"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    )
}

export default Pagination