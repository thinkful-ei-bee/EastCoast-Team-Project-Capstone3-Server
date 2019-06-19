const xss = require('xss')
const userProfileService ={
  getAllUserProfiles(db){
    return db 
      .select('*')
      .from('user_profile')
  },
  getCurrentUserProfile(db,id){
    return db       
    .from('user_profile')
    .select(
      'user_profile.id',
      'user_profile.profile_picture',
      'user_profile.music_like',
      'user_profile.movie_like',
      'user_profile.me_intro',
      'user_profile.user_id',        
      'users.gender',
      'users.email',
      'users.full_name',     
    )
    .innerJoin('users','users.id','user_profile.user_id')
    .where('user_profile.user_id',id)
  },
  getById(db,id){
    return db
      .select('*')
      .from('user_profile')
      .where('id',id)
      .first()
  },
  updateUserProfile(db,id,updateProfile){
    return db ('user_profile')
      .where('user_id', id)
      .update(updateProfile)
      .returning('*')
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
  },
  getProfileGender(db) {
    return db
      .select ()
  }

}


module.exports = userProfileService