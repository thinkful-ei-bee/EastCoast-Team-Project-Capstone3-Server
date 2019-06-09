const xss = require('xss')
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
  },
  serializeUserProfile(profile){
    return{
      id:profile.id,      
      profile_picture:xss(profile.profile_picture),
      music_like:xss(profile.music_like),
      movie_like:xss(profile.movie_like),
      me_intro:xss(profile.me_intro),
      user_id:profile.user_id      
    }
  }

}


module.exports = userProfileService