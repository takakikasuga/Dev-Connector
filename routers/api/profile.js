const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route     GET api/profile/me
// @desc      Get current users profile
// @access    Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id;の中にはユーザーの一意のIDが格納されている
    // .populateは他のコレクションの中のデータを組み込む
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    console.log('profile', profile);
    if (!profile) {
      return res
        .status(400)
        .json({ msg: ' There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/profile
// @desc      Create or update user profile
// @access    Private

router.post(
  '/',
  [
    auth,
    [
      body('status', 'Status is required').not().isEmpty(),
      body('skills', 'Skills is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
      // spread the rest of the fields we don't need to check
      // ...rest
    } = req.body;

    // プロフィールオブジェクトの初期化
    const profileFields = {};
    // req.user.id;はユーザーの一意のID（ミドルウェアで取得）
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    console.log('skills', skills);
    console.log('profileFields', profileFields);

    // ソーシャルネットワークオブジェクトの初期化
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;

    console.log('profileFields', profileFields);

    try {
      //  req.user.id;はユーザーの一意のID
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update（既にプロフィール情報があった場合は更新をする）
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// @route     GET api/profile
// @desc      Get all profile
// @access    Public

router.get('/', async (req, res) => {
  try {
    // userはプロパティの一意のIDを示し、それに紐づくname,avatarを取得している
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/profile/user/:user_id
// @desc      Get profile by user ID
// @access    Public

router.get('/user/:user_id', async (req, res) => {
  try {
    // userはプロパティの一意のIDを示し、それに紐づくname,avatarを取得している
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/profile
// @desc      Delete profile, user & posts
// @access    Private

router.delete('/', auth, async (req, res) => {
  try {
    //@todo - remove users posts
    //プロフィールを削除
    await Profile.findOneAndRemove({ user: req.user.id });
    // ユーザーを削除
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route     PUT api/profile/experience
// @desc      Add profile experience
// @access    Private

router.put(
  '/experience',
  [
    auth,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('company', 'Company is required').not().isEmpty(),
      body('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = { title, company, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      console.log('profile.experience', profile.experience);
      // unshift;配列の一番上に追加していく
      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// @route     DELETE api/profile/experience/:exp_id
// @desc      Delete experience from profile
// @access    Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // _idはidでも取得することが可能である
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
