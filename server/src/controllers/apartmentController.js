import ApartmentModel from '../models/Apartment.js';

export default class ApartmentController {
    static async getSome(req, res) {
        const { numberOfBedrooms, district, page = 1, limit = 20, sortBy } = req.query;
        
        try {
            const apartments = await ApartmentModel.find({
                numberOfBedrooms,
                'address.district': district
            })
                .limit(limit)
                .skip((page - 1) * limit)
                .sort(ApartmentController.#validateSortBy(sortBy));
            res.status(200).json(apartments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static async show(req, res) {
        try {
            const apartment = await ApartmentModel.findById(req.params.id).select('-__v');
            res.status(200).json(apartment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static async create(req, res) {
        const { name, numberOfBedrooms, address, price, description } = req.body;
        try {
            const apartment = await ApartmentModel.create({ 
                name,
                numberOfBedrooms,
                address,
                price,
                description,
                owner: req.userInfo.id
            });
            res.status(201).json(apartment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async #validateSortBy(sortBy) {
        return ['price', 'created_at'].includes(sortBy) ? sortBy : 'created_at';
    }
}
