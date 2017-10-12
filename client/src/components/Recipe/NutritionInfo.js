import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const styles = {
  radioButton: {
    marginTop: 16,
  },
};

/**
 * Dialog content can be scrollable.
 */
export default class NutritionInfo extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    const { recipe } = this.props;

    return (
      <div>
        <RaisedButton labelColor="#fff" backgroundColor="#E34B27" hoverColor="#C32B07" label="Nutrition Facts" onClick={this.handleOpen} />
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          autoDetectWindowHeight={true}
        >
          <div className="performance-container">
            <section className="performance-facts">
              <header className="performance-facts__header">
                <h1 className="performance-facts__title">Nutrition Facts</h1>
                <p>Serving Size 1</p>
                <p>Servings Per Meal {recipe.serves}</p>
              </header>
              <table className="performance-facts__table">
                <thead>
                  <tr>
                    <th colspan="3" className="small-info">
                      Amount Per Serving
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colspan="2">
                      <b>Calories</b>
                      {Math.floor(recipe.calories / recipe.serves)}
                    </th>
                  </tr>
                  <tr className="thick-row">
                    <td colspan="3" className="small-info">
                      <b>% Daily Value*</b>
                    </td>
                  </tr>

                  {recipe.digest.slice(0, 9).map(nut => {
                    let individualServe = Math.floor(nut.total / recipe.serves);
                    let individualDaily = Math.floor(nut.daily / recipe.serves)
         
                    return (
                      <tr>
                        <th colspan="2">
                          <b>{nut.label}</b>
                          {individualServe}g
                        </th>
                        <td>
                          <b>{individualDaily}%</b>
                        </td>
                      </tr>
                    )
                    
                  })}

                </tbody>
              </table>

              <p className="small-info">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs:</p>
              
              <table className="performance-facts__table--small small-info">
                <thead>
                  <tr>
                    <td colspan="2"></td>
                    <th>Calories:</th>
                    <th>2,000</th>
                    <th>2,500</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colspan="2">Total Fat</th>
                    <td>Less than</td>
                    <td>65g</td>
                    <td>80g</td>
                  </tr>
                  <tr>
                    <td className="blank-cell"></td>
                    <th>Saturated Fat</th>
                    <td>Less than</td>
                    <td>20g</td>
                    <td>25g</td>
                  </tr>
                  <tr>
                    <th colspan="2">Cholesterol</th>
                    <td>Less than</td>
                    <td>300mg</td>
                    <td>300 mg</td>
                  </tr>
                  <tr>
                    <th colspan="2">Sodium</th>
                    <td>Less than</td>
                    <td>2,400mg</td>
                    <td>2,400mg</td>
                  </tr>
                  <tr>
                    <th colspan="3">Total Carbohydrate</th>
                    <td>300g</td>
                    <td>375g</td>
                  </tr>
                  <tr>
                    <td class="blank-cell"></td>
                    <th colspan="2">Dietary Fiber</th>
                    <td>25g</td>
                    <td>30g</td>
                  </tr>
                </tbody>
              </table>
              
              <p className="small-info">
                Calories per gram:
              </p>
              <p classNames="small-info text-center">
                Fat 9
                &bull;
                Carbohydrate 4
                &bull;
                Protein 4
              </p>
              
            </section>
          </div>
        </Dialog>
      </div>
    );
  }
}