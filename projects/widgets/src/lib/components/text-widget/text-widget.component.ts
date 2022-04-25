import { AfterViewInit, Component } from '@angular/core';
import { ElementType, LinkType, TextBox, TextBoxData } from 'text-box';
import { Background } from '../../classes/background';
import { Padding } from '../../classes/padding';
import { TextWidgetData } from '../../classes/text-widget-data';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';

@Component({
  selector: 'text-widget',
  templateUrl: './text-widget.component.html',
  styleUrls: ['./text-widget.component.scss']
})
export class TextWidgetComponent extends Widget implements AfterViewInit {
  public background: Background = new Background();
  public padding: Padding = new Padding();
  public textBoxData: Array<TextBoxData> = [];
  private textBox!: TextBox;

  ngOnInit() {
    this.type = WidgetType.Text;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.padding.setClasses(this.widgetElement);
    this.setText();
  }

  setWidget(textWidgetData: TextWidgetData) {
    this.background.setData(textWidgetData.background);
    this.padding.setData(textWidgetData.padding);

    textWidgetData.textData = [
      {
        elementType: ElementType.Div,
        children: [
          {
            elementType: ElementType.Text,
            text: 'The '
          },
          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'font-family',
                value: '"Comic Sans MS", cursive, sans-serif'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'quick '
              }
            ]
          },
          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'color',
                value: '#ff00ff'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'brown '
              }
            ]
          },
          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'font-size',
                value: '18px'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'fox '
              },
              {
                elementType: ElementType.Span,
                styles: [
                  {
                    name: 'background-color',
                    value: '#ffff00'
                  },
                  {
                    name: 'color',
                    value: '#000000'
                  }
                ],
                children: [
                  {
                    elementType: ElementType.Text,
                    text: 'ju'
                  },
                  {
                    elementType: ElementType.Span,
                    styles: [
                      {
                        name: 'color',
                        value: '#ff0000'
                      }
                    ],
                    children: [
                      {
                        elementType: ElementType.Text,
                        text: 'mps'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            elementType: ElementType.Text,
            text: ' over '
          },
          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'font-weight',
                value: 'bold'
              },
              {
                name: 'font-style',
                value: 'italic'
              },
              {
                name: 'text-decoration',
                value: 'underline'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'the lazy dog.'
              }
            ]
          }
        ]
      },
      {
        elementType: ElementType.Div,
        children: [
          {
            elementType: ElementType.Break
          }
        ]
      },
      {
        elementType: ElementType.Div,
        children: [
          {
            elementType: ElementType.Text,
            text: 'This is a bullet list:'
          }
        ]
      },
      {
        elementType: ElementType.UnorderedList,
        children: [
          {
            elementType: ElementType.ListItem,
            children: [
              {
                elementType: ElementType.Span,
                styles: [
                  {
                    name: 'color',
                    value: '#00ff00'
                  }
                ],
                children: [
                  {
                    elementType: ElementType.Text,
                    text: 'A'
                  },
                  {
                    elementType: ElementType.Span,
                    styles: [
                      {
                        name: 'color',
                        value: '#ff0000'
                      }
                    ],
                    children: [
                      {
                        elementType: ElementType.Text,
                        text: 'l'
                      },



                      {
                        elementType: ElementType.Span,
                        styles: [
                          {
                            name: 'color',
                            value: '#d5c617'
                          }
                        ],
                        children: [
                          {
                            elementType: ElementType.Text,
                            text: 'i'
                          },
                          {
                            elementType: ElementType.Span,
                            styles: [
                              {
                                name: 'color',
                                value: '#ff00ff'
                              }
                            ],
                            children: [
                              {
                                elementType: ElementType.Text,
                                text: 't'
                              },
                              {
                                elementType: ElementType.Span,
                                styles: [
                                  {
                                    name: 'color',
                                    value: '#00ffff'
                                  }
                                ],
                                children: [
                                  {
                                    elementType: ElementType.Text,
                                    text: 'a!'
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }



                    ]
                  }
                ]
              }
            ]
          },
          {
            elementType: ElementType.ListItem,
            children: [
              {
                elementType: ElementType.Span,
                styles: [
                  {
                    name: 'color',
                    value: '#ffff00'
                  }
                ],
                children: [
                  {
                    elementType: ElementType.Text,
                    text: 'Battle'
                  }
                ]
              }
            ]
          },
          {
            elementType: ElementType.UnorderedList,
            children: [
              {
                elementType: ElementType.ListItem,
                children: [
                  {
                    elementType: ElementType.Span,
                    styles: [
                      {
                        name: 'font-weight',
                        value: 'bold'
                      }
                    ],
                    children: [
                      {
                        elementType: ElementType.Text,
                        text: 'Trumpy'
                      }
                    ]
                  }
                ]
              },
              {
                elementType: ElementType.ListItem,
                children: [
                  {
                    elementType: ElementType.Span,
                    styles: [
                      {
                        name: 'color',
                        value: '#ff0000'
                      }
                    ],
                    children: [
                      {
                        elementType: ElementType.Text,
                        text: 'Alita'
                      }
                    ]
                  }
                ]
              },


              {
                elementType: ElementType.UnorderedList,
                children: [
                  {
                    elementType: ElementType.ListItem,
                    children: [
                      {
                        elementType: ElementType.Text,
                        text: 'Make'
                      }
                    ]
                  },



                  {
                    elementType: ElementType.UnorderedList,
                    children: [
                      {
                        elementType: ElementType.ListItem,
                        children: [
                          {
                            elementType: ElementType.Text,
                            text: 'America'
                          }
                        ]
                      },



                      {
                        elementType: ElementType.UnorderedList,
                        children: [
                          {
                            elementType: ElementType.ListItem,
                            children: [
                              {
                                elementType: ElementType.Text,
                                text: 'Great'
                              }
                            ]
                          },


                          {
                            elementType: ElementType.UnorderedList,
                            children: [
                              {
                                elementType: ElementType.ListItem,
                                children: [
                                  {
                                    elementType: ElementType.Text,
                                    text: 'Again'
                                  }
                                ]
                              }
                            ]
                          }


                        ]
                      }



                    ]
                  }




                ]
              },


              {
                elementType: ElementType.ListItem,
                children: [
                  {
                    elementType: ElementType.Text,
                    text: 'Hello'
                  }
                ]
              }



            ]
          },

          {
            elementType: ElementType.ListItem,
            children: [
              {
                elementType: ElementType.Text,
                text: 'There'
              }
            ]
          }
        ]
      },
      {
        elementType: ElementType.Div,
        indent: 2,
        children: [
          {
            elementType: ElementType.Text,
            text: 'MAGA!'
          }
        ]
      },
      {
        elementType: ElementType.Div,
        children: [
          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'color',
                value: '#ff0000'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'H'
              }
            ]
          },

          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'color',
                value: '#00ff00'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'e'
              }
            ]
          },

          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'color',
                value: '#0000ff'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'l'
              }
            ]
          },

          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'color',
                value: '#ff00ff'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'l'
              }
            ]
          },

          {
            elementType: ElementType.Span,
            styles: [
              {
                name: 'color',
                value: '#00ffff'
              }
            ],
            children: [
              {
                elementType: ElementType.Text,
                text: 'o'
              }
            ]
          }
        ]
      },
      {
        elementType: ElementType.Div,
        children: [
          {
            elementType: ElementType.Text,
            text: 'This is a numbered list:'
          }
        ]
      },
      {
        elementType: ElementType.OrderedList,
        children: [
          {
            elementType: ElementType.ListItem,
            children: [
              {
                elementType: ElementType.Text,
                text: 'First Item'
              }
            ]
          },
          {
            elementType: ElementType.ListItem,
            children: [
              {
                elementType: ElementType.Text,
                text: 'Second Item'
              }
            ]
          },
          {
            elementType: ElementType.ListItem,
            children: [
              {
                elementType: ElementType.Span,
                styles: [
                  {
                    name: 'color',
                    value: '#ff00ff'
                  }
                ],
                children: [
                  {
                    elementType: ElementType.Text,
                    text: 'Third Item'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementType: ElementType.Div,
        children: [
          {
            elementType: ElementType.Break
          }
        ]
      },
      {
        elementType: ElementType.Div,
        styles: [
          {
            name: 'text-align',
            value: 'center'
          },
        ],
        children: [
          {
            elementType: ElementType.Text,
            text: 'This is aligned center'
          }
        ]
      },
      {
        elementType: ElementType.Div,
        styles: [
          {
            name: 'text-align',
            value: 'right'
          },
        ],
        children: [
          {
            elementType: ElementType.Text,
            text: 'This is aligned right'
          }
        ]
      },
      {
        elementType: ElementType.Div,
        children: [
          {
            elementType: ElementType.Text,
            text: 'This is a link to '
          },
          {
            elementType: ElementType.Anchor,
            link: {
              url: 'https://truthsocial.com/',
              linkType: LinkType.WebAddress,

            },
            children: [
              {
                elementType: ElementType.Text,
                text: 'TRUTH Social'
              }
            ]
          }
        ]
      }
    ]

    if (textWidgetData.textData) this.textBoxData = textWidgetData.textData;

    super.setWidget(textWidgetData);
  }

  setText() {
    this.textBox = new TextBox(this.widgetElement);

    if (this.textBoxData && this.textBoxData.length > 0) {
      this.textBox.load(this.textBoxData);
      this.textBox.render();
    }
  }
}