export default {
    BASE_URL: 'https://pixabay.com/api',
    PAGE_SIZE: 12,
    API_KEY: '20679339-fea13a2297aa7649e9595d106',

    currentPage: 1,
    isLastPage: true,
    currentQuery: '',

    async fetchByCurrParams() {
        const url = `${this.BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.currentQuery}&page=${this.currentPage}&per_page=${this.PAGE_SIZE}&key=${this.API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('request was rejected by server');
        }

        return await response.json();
    },

    async getHitsByCurrParams() {
        const result = await this.fetchByCurrParams();

        const totalHitsCount = this.currentPage * this.PAGE_SIZE;
        this.isLastPage = totalHitsCount >= result.totalHits;

        return result.hits;
    },

    async getFirstPageHits(query = '') {
        this.currentPage = 1;
        this.currentQuery = query;
        this.isLastPage = false;

        return await this.getHitsByCurrParams();
    },

    async getNextPageHits() {
        if (this.isLastPage) {
            return [];
        }

        this.currentPage++;

        return await this.getHitsByCurrParams();
    },
};
