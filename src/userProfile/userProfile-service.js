const xss = require('xss')
const userProfileService ={
  getAllUserProfiles(db){
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
  },

  getById(db,id){
    return db
    .from('user_profile AS usp')
    .select(
      'usp.profile_picture',
      'usp.music_like',
      'usp.movie_like',
      'usp.me_intro',
      'usp.user_id',        
      'usr.gender',
      'usr.email',
      'usr.full_name',        
    )
    .join('users AS usr','usp.user_id','usr.id')
      .where('usp.user_id',id)
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
      user_id:profile.user_id,    
      gender:profile.gender,
      email:profile.email,
      full_name:profile.full_name
    }
  }

}


module.exports = userProfileService