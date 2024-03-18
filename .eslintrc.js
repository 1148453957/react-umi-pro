module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  "rules": {
    "eqeqeq": "off"
  },
  "settings": {
    "react": {                  
         "version": "detect"        
    }
}
};
