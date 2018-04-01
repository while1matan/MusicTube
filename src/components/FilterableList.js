import React from 'react';
import {ListGroup,ListGroupItem,Badge,FormControl} from 'react-bootstrap';

export default class FilterableList extends React.Component {
    constructor(props){
        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);

        this.state = {
            query : ""
        };
    }

    handleSearch(event){
        this.setState({"query" : event.target.value.toLowerCase()});
    }

    handleItemClick(event){
        event.preventDefault();
        this.props.onItemClick(event);
    }

    render(){

        if(this.props.items.length <= 0){
            return this.props.emptyListText;
        }

        const filteredItems = this.props.items.filter(
            (item) => {
                return item.value.toLowerCase().search(this.state.query) !== -1;
            }
        );

        return (
            <div className="filterableList">
                <FormControl
                    type="text"
                    placeholder={this.props.searchPlaceHolder}
                    onChange={this.handleSearch} />

                <ListGroup>
                    {
                        filteredItems.length <= 0 ? this.props.emptyResultText : (
                            filteredItems.map((item) => {
                                return (
                                    <ListGroupItem
                                        onClick={(event) => {this.handleItemClick(event)}}
                                        key={item.id}
                                        id={item.id}
                                        active={this.props.selectedId === item.id}>
                                        {item.value}
                                        <Badge>{item.badge}</Badge>
                                    </ListGroupItem>
                                );
                            })
                        )
                    }
                </ListGroup>
            </div>
        );
    }
}