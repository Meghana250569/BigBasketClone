const Address=require('../models/addressModel')

exports.createAddress=async (req,res)=>{
    try{
        const {
            fullName,
            phoneNumber,
            houseNo,
            street,
            landmark,
            city,
            pincode,
            isDefault
        }=req.body

        if(!fullName || !phoneNumber || !houseNo || !!street || !city || !pincode){
            return res.status(400).json({
                success:false,
                message:"All fields are  required"
            });
        }

        if(phoneNumber.length !==10){
            return res.status(400).json({
                success:false,
                message:"Phone Number should be 10 digits "
            });
        }

        if(pincode.length !==6){
            return res.status(400).json({
                success:false,
                message:"Invalid pincode"
            });
        }

       const existingAddress=await Address.countDocuments({
            userId:req.user.id
       });
       let defaultValue= isDefault || false
       
       if(existingAddress ===0){
            defaultValue=true
       };

       if(defaultValue){
            await Address.updateMany(
                {userId:req.user.id},
                {isDefault:false}
            );
       }

       const address=await Address.create({
            userId: req.user.id,
            fullName,
            phoneNumber,
            houseNo,
            street,
            landmark,
            city,
            pincode,
            isDefault: defaultValue
       } );

       res.status(201).json({
        success:true,
        message:"Address created successfully"
       });

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.getAddresses=async (req,res) =>{
    try {
        const addresses=(await Address.find({userId:req.user.id})).sort({isDefault:-1, createedAt:-1})

        res.status(200).json({
            success:true,
            count:addresses.length,
            data:addresses
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.getAddressById=async (req,res) =>{
    try {
        const address= await Address.find({
            _id:req.params.id,
            userId:req.user.id
        });

        if(!address){
            return res.status(404).json({
                success:false,
                message:"address not found"
            });
        }
        res.status(200).json({
            success:true,
            data:addrress
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.updateAddress= async (req,res)=>{
    try {
        const updateData={
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            houseNo: req.body.houseNo,
            street: req.body.street,
            landmark: req.body.landmark,
            city: req.body.city,
            pincode: req.body.pincode,
            isDefault: req.body.isDefault
        };

        Object.keys(updateData).forEach(
            key => updateData[key] === undefined && delete updateData[key]
        );

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
            success: false,
            message: "No fields provided for update"
        });
        }

        if (updateData.phoneNumber && updateData.phoneNumber.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 10 digits"
            });
        }

        if (updateData.pincode && updateData.pincode.length !== 6) {
            return res.status(400).json({
                success: false,
                message: "Pincode must be 6 digits"
            });
        }

         if (updateData.isDefault) {
            await Address.updateMany(
                { userId: req.user.id },
                { isDefault: false }
            );
        }

        const address = await Address.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: address
        });
    } catch (error) {
         res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        const wasDefault = address.isDefault;

        await address.deleteOne();

        if (wasDefault) {
            const nextAddress = await Address.findOne({
                userId: req.user.id
            }).sort({ createdAt: 1 });

            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};