'use strict';

class Paginate {

    public static getPaginateObject = (query: any, totalDocuments: number): any => {
        const { page, pageSize } = query;
        const intPage = parseInt(page);
        const intPageSize = parseInt(pageSize);
        const take = intPage * intPageSize;
        const subtractedItems = totalDocuments - take;
        const remainingDocuments = subtractedItems <= 0 ? 0 : subtractedItems;

        return {
            page: intPage,
            pageSize: intPageSize,
            remainingDocuments,
            totalDocuments
        }
    }

}

export { Paginate };