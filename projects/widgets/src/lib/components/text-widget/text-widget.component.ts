import { AfterViewInit, Component } from '@angular/core';
import { Background } from '../../classes/background';
import { Padding } from '../../classes/padding';
import { TextData } from '../../classes/text-data';
import { TextWidgetData } from '../../classes/text-widget-data';
import { Widget } from '../../classes/widget';
import { NodeType } from '../../classes/widget-enums';

@Component({
  selector: 'text-widget',
  templateUrl: './text-widget.component.html',
  styleUrls: ['./text-widget.component.scss']
})
export class TextWidgetComponent extends Widget implements AfterViewInit {
  public background: Background = new Background();
  public padding: Padding = new Padding();
  public textData: Array<TextData> = [];


  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.setText();
    this.padding.setClasses(this.widgetElement);
  }

  setWidget(textWidgetData: TextWidgetData) {
    this.background.setData(textWidgetData.background);
    this.padding.setData(textWidgetData.padding);

    textWidgetData.textData = [
      {
        nodeType: NodeType.Div,
        children: [
          {
            nodeType: NodeType.Text,
            text: 'The '
          },
          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'font-family',
                value: '"Comic Sans MS", cursive, sans-serif'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'quick '
              }
            ]
          },
          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'color',
                value: '#ff00ff'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'brown '
              }
            ]
          },
          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'font-size',
                value: '18px'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'fox '
              },
              {
                nodeType: NodeType.Span,
                styles: [
                  {
                    style: 'background-color',
                    value: '#ffff00'
                  },
                  {
                    style: 'color',
                    value: '#000000'
                  }
                ],
                children: [
                  {
                    nodeType: NodeType.Text,
                    text: 'ju'
                  },
                  {
                    nodeType: NodeType.Span,
                    styles: [
                      {
                        style: 'color',
                        value: '#ff0000'
                      }
                    ],
                    children: [
                      {
                        nodeType: NodeType.Text,
                        text: 'mps'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            nodeType: NodeType.Text,
            text: ' over '
          },
          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'font-weight',
                value: 'bold'
              },
              {
                style: 'font-style',
                value: 'italic'
              },
              {
                style: 'text-decoration',
                value: 'underline'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'the lazy dog.'
              }
            ]
          }
        ]
      },
      {
        nodeType: NodeType.Div,
        children: [
          {
            nodeType: NodeType.Br
          }
        ]
      },
      {
        nodeType: NodeType.Div,
        children: [
          {
            nodeType: NodeType.Text,
            text: 'This is a bullet list:'
          }
        ]
      },
      {
        nodeType: NodeType.Ul,
        children: [
          {
            nodeType: NodeType.Li,
            children: [
              {
                nodeType: NodeType.Span,
                styles: [
                  {
                    style: 'color',
                    value: '#00ff00'
                  }
                ],
                children: [
                  {
                    nodeType: NodeType.Text,
                    text: 'A'
                  },
                  {
                    nodeType: NodeType.Span,
                    styles: [
                      {
                        style: 'color',
                        value: '#ff0000'
                      }
                    ],
                    children: [
                      {
                        nodeType: NodeType.Text,
                        text: 'l'
                      },



                      {
                        nodeType: NodeType.Span,
                        styles: [
                          {
                            style: 'color',
                            value: '#0000ff'
                          }
                        ],
                        children: [
                          {
                            nodeType: NodeType.Text,
                            text: 'i'
                          },
                          {
                            nodeType: NodeType.Span,
                            styles: [
                              {
                                style: 'color',
                                value: '#ff00ff'
                              }
                            ],
                            children: [
                              {
                                nodeType: NodeType.Text,
                                text: 't'
                              },
                              {
                                nodeType: NodeType.Span,
                                styles: [
                                  {
                                    style: 'color',
                                    value: '#00ffff'
                                  }
                                ],
                                children: [
                                  {
                                    nodeType: NodeType.Text,
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
            nodeType: NodeType.Li,
            children: [
              {
                nodeType: NodeType.Span,
                styles: [
                  {
                    style: 'color',
                    value: '#ffff00'
                  }
                ],
                children: [
                  {
                    nodeType: NodeType.Text,
                    text: 'Battle'
                  }
                ]
              }
            ]
          },
          {
            nodeType: NodeType.Ul,
            children: [
              {
                nodeType: NodeType.Li,
                children: [
                  {
                    nodeType: NodeType.Span,
                    styles: [
                      {
                        style: 'font-weight',
                        value: 'bold'
                      }
                    ],
                    children: [
                      {
                        nodeType: NodeType.Text,
                        text: 'Trumpy'
                      }
                    ]
                  }
                ]
              },
              {
                nodeType: NodeType.Li,
                children: [
                  {
                    nodeType: NodeType.Span,
                    styles: [
                      {
                        style: 'color',
                        value: '#ff0000'
                      }
                    ],
                    children: [
                      {
                        nodeType: NodeType.Text,
                        text: 'Alita'
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
        nodeType: NodeType.Div,
        children: [
          {
            nodeType: NodeType.Text,
            text: 'MAGA!'
          }
        ]
      },
      {
        nodeType: NodeType.Div,
        children: [
          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'color',
                value: '#ff0000'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'H'
              }
            ]
          },

          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'color',
                value: '#00ff00'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'e'
              }
            ]
          },

          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'color',
                value: '#0000ff'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'l'
              }
            ]
          },

          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'color',
                value: '#ff00ff'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'l'
              }
            ]
          },

          {
            nodeType: NodeType.Span,
            styles: [
              {
                style: 'color',
                value: '#00ffff'
              }
            ],
            children: [
              {
                nodeType: NodeType.Text,
                text: 'o'
              }
            ]
          }
        ]
      },
      {
        nodeType: NodeType.Div,
        children: [
          {
            nodeType: NodeType.Text,
            text: 'This is a numbered list:'
          }
        ]
      },
      {
        nodeType: NodeType.Ol,
        children: [
          {
            nodeType: NodeType.Li,
            children: [
              {
                nodeType: NodeType.Text,
                text: 'First Item'
              }
            ]
          },
          {
            nodeType: NodeType.Li,
            children: [
              {
                nodeType: NodeType.Text,
                text: 'Second Item'
              }
            ]
          },
          {
            nodeType: NodeType.Li,
            children: [
              {
                nodeType: NodeType.Span,
                styles: [
                  {
                    style: 'color',
                    value: '#ff00ff'
                  }
                ],
                children: [
                  {
                    nodeType: NodeType.Text,
                    text: 'Third Item'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        nodeType: NodeType.Div,
        children: [
          {
            nodeType: NodeType.Br
          }
        ]
      },
      {
        nodeType: NodeType.Div,
        styles: [
          {
            style: 'text-align',
            value: 'center'
          },
        ],
        children: [
          {
            nodeType: NodeType.Text,
            text: 'This is aligned center'
          }
        ]
      },
      {
        nodeType: NodeType.Div,
        styles: [
          {
            style: 'text-align',
            value: 'right'
          },
        ],
        children: [
          {
            nodeType: NodeType.Text,
            text: 'This is aligned right'
          }
        ]
      },
      {
        nodeType: NodeType.Div,
        children: [
          {
            nodeType: NodeType.Text,
            text: 'This is a link to '
          },
          {
            nodeType: NodeType.A,
            link: 'https://truthsocial.com/',
            children: [
              {
                nodeType: NodeType.Text,
                text: 'TRUTH Social'
              }
            ]
          }
        ]
      }
    ]

    if (textWidgetData.textData) this.textData = textWidgetData.textData;

    super.setWidget(textWidgetData);
  }

  setText() {

  }

}
