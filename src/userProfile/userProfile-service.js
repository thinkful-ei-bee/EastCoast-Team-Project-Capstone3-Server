const userProfileService ={
  getAllUserProfiles(db){
    return db 
      .select('*')
      .from('user_profile')
  },
  getById(db,id){
    return db
      .select('*')
      .from('user_profile')
      .where('id',id)
      .first()
  },
  updateUserProfile(db,id,updateProfile){
    return db 
      .where({id})
      .update(updateProfile)
  },
  deleteUserProfile(db,id){
    return db 
      .where({id}).delete()      
  },
  insertUserProfile(db,newProfile){
    return db 
      .insert(newProfile)
      .into('user_profile')
      .returning('*')
  }

}


module.exports = userProfileService