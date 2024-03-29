/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useTheme, MessageBar, DefaultButton, DocumentCardImage, DocumentCardTitle, Text, DocumentCardPreview, mergeStyles, Separator, DocumentCard, DocumentCardDetails, Stack, Checkbox, ImageFit, MessageBarType, FontIcon } from '@fluentui/react';

const iconClass = mergeStyles({
    fontSize: 80,
    margin: '0 80px'
});

const headerIconClass = mergeStyles({
    fontSize: 35,
    height: 25,
    width: 50,
    margin: '0px 10px',
});

const headerText = mergeStyles({
    lineHeight: 25,
    margin: '0px 5px',
    verticalAlign: 'top'
});

export const SeparatorStyle = {
    root: [{
      marginTop: "15px !important",
      marginBottom: "15px",
      fontSize: "15px",
      fontWeight: "600",
      selectors: {
        '::before': {
          background: "rgb(0, 103, 184)",
        },
      }
    }]
  };

export function Presets({ description, icon, sections, selectedValues, updateSelected, featureFlag }) {

    const bodyBackground = useTheme().semanticColors.bodyBackground;

    return (
    <div>
        { description != null && description !== "" &&
            <>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', width:'100%'}}>
                    <FontIcon aria-label={icon} iconName={icon} className={headerIconClass} />
                    <Text variant={'mediumPlus'} className={headerText} >{description}</Text>
                </div>
            </>
        }
      { sections.map(s => [
        <Separator key={`sep${s.key}`} styles={SeparatorStyle}><span style={{"color": "rgb(0, 103, 184)"}}>{s.sectionTitle}</span></Separator>,

        <Stack key={`st${s.key}`} horizontal tokens={{ childrenGap: 10 }}>
            <Text variant="mediumPlus" styles={{ root: { marginBottom: "15px" } }} >{s.sectionDescription}</Text>
            { s.sectionMoreInfoLink != null &&
            <DefaultButton
              href={s.sectionMoreInfoLink}
              target="_blank" title="More information"
              iconProps={{iconName: 'Info'}}
              styles={{ root: { height: 'auto', marginBottom: '12px' } }}>
                More Info
            </DefaultButton>
            }
        </Stack>,
        //<span class="htmlText" dangerouslySetInnerHTML={{ __html: s.sectionDescription }} />,

        <div key={`warn${s.key}`}>
            {s.sectionWarning &&
                <MessageBar key={`messg${s.key}`} styles={{ root: { marginBottom: "15px", fontSize: "15px" } }} messageBarType={MessageBarType.severeWarning}>{s.sectionWarning}</MessageBar>
            }
        </div>,
        <Stack data-testid={`stack${s.key}`} key={`stack${s.key}`} horizontal horizontalAlign='center' tokens={{ childrenGap: 15 }}>
            {s.cards.map((c, i) =>
                <DocumentCard  key={c.key}   onClick={() => updateSelected(s.key, c.key)} tokens={{ childrenMargin: 12 }}>

                    <DocumentCardDetails styles={{ root: { padding: "8px 16px", position: "relative" } }}>
                        <Checkbox inputProps={{ 'data-testid': `portalnav-presets-${s.key}-${c.key}-Checkbox`}} checked={selectedValues[s.key] === c.key} label={c.title} styles={{ label: { fontWeight: selectedValues[s.key] === c.key ? '500' : 'normal' } }} />
                    </DocumentCardDetails>

                    <Stack key={`sum${s.key}`} height={'100px'} enableScopedSelectors horizontal tokens={{ childrenGap: 10  }}>
                        <Stack.Item align="start" grow={false}>
                            {c.imageSrc &&
                                <DocumentCardImage styles={{ root: { backgroundColor: bodyBackground } }}
                                imageSrc={c.imageSrc}
                                height={150}
                                imageFit={ImageFit.centerContain} />
                            }
                            {c.icon &&
                                <DocumentCardPreview
                                    styles={{ root: { backgroundColor: bodyBackground, borderBottom: '0' } }}
                                    width={'80px'}
                                    previewImages={[{
                                        previewIconProps: {
                                            iconName: c.icon, className: iconClass
                                        }, height: 100, width: 100
                                    },]}
                                />
                            }
                        </Stack.Item>

                        {c.description.title &&
                            <Stack.Item styles={{root: {paddingTop: 10, paddingRight:10}}} height={100}>
                                <Text>
                                    {c.description.title}
                                </Text>
                            </Stack.Item>
                        }
                    </Stack>

                    <div style={{ padding: "8px 16px" }} >
                        <Text>
                            {c.description.titleWarning &&
                                <MessageBar messageBarType={c.description.titleWarning.MessageBarType}>
                                    <Text >{c.description.titleWarning.description}</Text>
                                </MessageBar>

                            }
                            <Text variant="smallPlus" >
                                <ul style={{ paddingInlineStart: "20px" }}>
                                    {c.description.bulets.filter(b=> !b.hasOwnProperty('featureFlag') || featureFlag.includes(b.featureFlag) ).map((b, i) =>
                                        <li key={i}>
                                            {b.description}
                                            {b.linksrc && <span> (<a target="_nsg" href={b.linksrc}>docs</a>)</span>}
                                        </li>
                                    )}
                                </ul>
                            </Text>
                        </Text>
                    </div>

                    {/* {c.author &&
                        <DocumentCardActivity activity={c.author.status} people={[{ name: c.author.name, initials: c.author.initials }]} />
                    } */}
                </DocumentCard>
            )}
        </Stack>
    ])
}
</div>)
}