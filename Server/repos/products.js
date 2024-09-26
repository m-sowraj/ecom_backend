class ProductRepository {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('ecom_products');
    }

    static getCurrentISODate() {
        return new Date().toISOString();
      }
    // Create a new product
    async createProduct(data) {
        // Set createdAt and updatedAt timestamps
        data.created_at = ProductRepository.getCurrentISODate();
        data.updated_at = ProductRepository.getCurrentISODate();
    
        // Create a batch for multiple operations
        const batch = this.db.batch();
    
        // Reference for the new product document
        const productRef = this.collection.doc(data.id); // Use data.id for document ID
        batch.set(productRef, data); // Queue the set operation
    
        // Commit the batch
        await batch.commit();
    
        // Return the created product data
        return { id: data.id, ...data };
    }
    
        
    // Get a product by ID
    async getProductById(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error('Product not found');
        }
    }

    // Get all products by category ID with pagination
    async getAllProducts(query) {

            const limit = query.limit ? parseInt(query.limit) : 10; // Default limit
            const page = query.page ? parseInt(query.page) : 1; // Default page
            const ref = this.collection;
        
            // Create a base query
            let baseQuery = ref.limit(limit);
        
            // Filter by name if provided
            if (query.name) {
                baseQuery = baseQuery.where('name', '==', query.name);
            }

            // Filter by category if provided
            if (query.categoryId) {
                baseQuery = baseQuery.where('categoryId', '==', query.categoryId);
            }
        
            // Initialize an array for categories
            const categories = [];
            let snapshot;
        
            // Fetch documents for the current page
            try {
                snapshot = await baseQuery.get();
                snapshot.forEach((doc) => {
                    categories.push({ id: doc.id, ...doc.data() });
                });
            } catch (error) {
                console.error("Error fetching Products:", error);
                throw new Error('Error fetching Products');
            }
        
            // Pagination details
            const totalRecords = await this.getTotalRecords(query); // Function to count total records
            const totalPages = Math.ceil(totalRecords / limit);
            const currentPage = page;
        
            const pagination = { totalRecords, totalPages, currentPage, limit };
        
            return { categories, pagination };
        }
        

    // Function to count total products by category
    async getTotalProductsByCategory(categoryId) {
        const snapshot = await this.collection.where('categoryId', '==', categoryId).get();
        return snapshot.size; // Return the total number of records
    }

    // Update a product by ID
    async updateProduct(id, data) {
        data.updatedAt = new Date();
        const docRef = this.collection.doc(id);
        await docRef.update(data);
        const updatedProduct = await docRef.get();
        return { id: updatedProduct.id, ...updatedProduct.data() };
    }

    // Delete a product by ID
    async deleteProduct(id) {
        const docRef = this.collection.doc(id);
        await docRef.delete();
        return { id, message: 'Product deleted successfully' };
    }

    //getCategoryById
    async getCategoryById(id) {
        const docRef = this.db.collection('categories').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error('Category not found');
        }
    }
}

module.exports = ProductRepository;
