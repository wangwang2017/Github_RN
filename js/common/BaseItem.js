import React,{Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {PropTypes} from 'prop-types';

export default class BaseItem extends Component {
    static propTypes={
        projectModels:PropTypes.object,
        onSelect:PropTypes.func,
        onFavorite:PropTypes.func,
    };

    constructor(props){
        super(props);
        this.state={
            isFavorite:this.props.projectModels.isFavorite,
        }
    }

    setFavoriteState(isFavorite){
        this.props.projectModels.isFavorite = isFavorite;
        this.setState({
            isFavorite:isFavorite,
        })
    }

    /**
     * 牢记：https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md
     * componentWillReceiveProps在新版React中不能再用了
     * @param nextProps
     * @param prevState
     * @returns {*}
     */
    static getDerivedStateFromProps(nextProps,prevState){
        const isFavorite = nextProps.projectModels.isFavorite;
        if (prevState.isFavorite !== isFavorite){
            return{
                isFavorite:isFavorite,
            };
        }
        return null;
    }

    onPressFavorite(){
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModels.item,!this.state.isFavorite);
    }

    _favoriteIcon(){
            return <TouchableOpacity
                style={{padding:6}}
                underlayColor={'transparent'}
                onPress={() =>this.onPressFavorite()}
            >
                <FontAwesome
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={26}
                    style={{color:'#678'}}
                />
            </TouchableOpacity>
        }

}