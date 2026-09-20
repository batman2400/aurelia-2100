from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle, KeepTogether

ROOT = Path(__file__).parent
OUT = ROOT / 'Team Fade.pdf'
PAGE_W, PAGE_H = A4
mint = colors.HexColor('#118a78')
aqua = colors.HexColor('#087d98')
ink = colors.HexColor('#102326')
muted = colors.HexColor('#557174')
soft = colors.HexColor('#eef7f4')
line = colors.HexColor('#d6e5e1')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleX', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=29, leading=32, textColor=ink, spaceAfter=10))
styles.add(ParagraphStyle(name='SubX', parent=styles['Normal'], fontSize=15, leading=20, textColor=muted, spaceAfter=18))
styles.add(ParagraphStyle(name='H2X', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=20, leading=23, textColor=mint, spaceAfter=9))
styles.add(ParagraphStyle(name='H3X', parent=styles['Heading3'], fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=ink, spaceBefore=7, spaceAfter=4))
styles.add(ParagraphStyle(name='BodyX', parent=styles['BodyText'], fontSize=9.5, leading=13, textColor=ink, spaceAfter=7))
styles.add(ParagraphStyle(name='SmallX', parent=styles['BodyText'], fontSize=8.5, leading=11, textColor=muted, alignment=TA_CENTER, spaceAfter=8))
styles.add(ParagraphStyle(name='EyebrowX', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=aqua, spaceAfter=10))
styles.add(ParagraphStyle(name='CoverMeta', parent=styles['Normal'], fontSize=9, leading=12, textColor=ink))


def P(text, style='BodyX'):
    return Paragraph(text, styles[style])

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(line)
    canvas.line(16*mm, 12*mm, PAGE_W-16*mm, 12*mm)
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(muted)
    canvas.drawString(16*mm, 7*mm, 'Transportation 2100')
    canvas.drawRightString(PAGE_W-16*mm, 7*mm, str(doc.page))
    canvas.restoreState()

def bullet(items):
    return [P('&bull; ' + item, 'BodyX') for item in items]

def screen_page(kicker, title, note, image_name, caption):
    image = Image(str(ROOT / 'report-assets' / image_name), width=92*mm, height=199*mm)
    image.hAlign = 'CENTER'
    return [P(kicker, 'EyebrowX'), P(title, 'H2X'), P(note, 'SmallX'), image, Spacer(1, 5), P(caption, 'SmallX'), PageBreak()]

story = []
story += [Spacer(1, 32*mm), P('INTERACTIVE MOBILITY CONCEPT · PROJECT REPORT', 'EyebrowX'), P('Transportation <font color="#118a78">2100</font>', 'TitleX'), P('Human-first movement through an interactive anti-gravity metropolis.', 'SubX'), Spacer(1, 72*mm)]
meta = [[P('<b>TEAM NAME</b><br/>Team Fade', 'CoverMeta'), P('<b>SYSTEM NAME</b><br/>Aurelia-2100', 'CoverMeta')], [P('<b>HOSTED LINK</b><br/><font color="#05677a">https://aurelia-2100.vercel.app</font>', 'CoverMeta'), P('<b>BACKUP REFERENCE</b><br/><font color="#05677a">https://aurelia-2100.vercel.app</font>', 'CoverMeta')]]
t = Table(meta, colWidths=[82*mm, 82*mm], rowHeights=[20*mm, 20*mm])
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),soft),('BOX',(0,0),(-1,-1),0.7,line),('INNERGRID',(0,0),(-1,-1),0.5,line),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8)]))
story += [t, PageBreak()]

story += [P('01 · CONCEPT AND DESIGN REASONING', 'EyebrowX'), P('A city that makes movement legible', 'H2X'), P('Transportation 2100 imagines a future city where air transit, smart roads, autonomous buses, and underground rail work as one readable mobility network. The experience uses a living 3D city as visual context, then layers a calm journey-planning interface over it.', 'BodyX'), P('The design reasoning is human-first: the spectacle establishes place, but the interface prioritizes the next decision. Users choose a transport layer, choose a destination, review a route, and finally follow the vehicle live.', 'BodyX')]
callout = Table([[P('<b>Core idea:</b> Make futuristic infrastructure feel as understandable as checking a familiar trip on a phone.', 'BodyX')]], colWidths=[170*mm])
callout.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),soft),('BOX',(0,0),(-1,-1),0.7,mint),('LEFTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8)]))
story += [callout, P('Design principles', 'H3X')] + bullet(['<b>Progressive disclosure:</b> transport choices appear before selection and clear after a mode is chosen.', '<b>Scannability:</b> route time, transfer, safety, status, and destination are grouped into compact panels.', '<b>Feedback:</b> camera transitions, motion reveals, selected states, live labels, and route metrics explain system status.', '<b>Mobile reach:</b> large touch targets, bottom navigation, and a responsive destination drawer.'])
story += [P('Technology and implemented system', 'H3X')]
tech = [[P('<b>React 18 + TypeScript</b><br/>Typed component state and transit modes.', 'BodyX'), P('<b>Vite 5</b><br/>Development server and production bundling.', 'BodyX')], [P('<b>Three.js / React Three Fiber</b><br/>Procedural city, stars, corridors, and camera states.', 'BodyX'), P('<b>Framer Motion</b><br/>Screen transitions and interaction feedback.', 'BodyX')], [P('<b>Tailwind CSS + CSS</b><br/>Responsive layout and accessibility states.', 'BodyX'), P('<b>Lucide + Web Audio API</b><br/>Transport icons and procedural sounds.', 'BodyX')]]
t = Table(tech, colWidths=[82*mm,82*mm])
t.setStyle(TableStyle([('BOX',(0,0),(-1,-1),0.5,line),('INNERGRID',(0,0),(-1,-1),0.5,line),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7)]))
story += [t, PageBreak()]

story += screen_page('02 · REQUIRED SCREEN 1', 'Home / Search', 'Choose a mode and destination', 'home-search-mobile.png', 'The opening screen presents the anti-gravity city and four transport choices: Air transport, Autonomous train, Autonomous bus, and Smart roads. Selecting a mode reveals destination search, voice search, and quick destinations.')
story += screen_page('03 · REQUIRED SCREEN 2', 'Route Details', 'Review the journey before departure', 'route-details-mobile.png', 'The route view turns a destination choice into an actionable plan: arrival time, total duration, transfer information, safety state, smart rebooking, a three-step timeline, and a Follow this journey action.')
story += screen_page('04 · REQUIRED SCREEN 3', 'Live Tracking', 'Monitor the active journey', 'live-tracking-mobile.png', 'Live Tracking shows Rail 08 moving between Central Exchange and KDU Campus. A visual route map is paired with a status sheet for speed, current node, and safe travel conditions.')

story += [P('05 · USER FLOW AND REFERENCE', 'EyebrowX'), P('From city view to live journey', 'H2X')]
flow = [[P('<b>1. Explore.</b><br/>Start in the 3D city overview and choose a transport layer.', 'BodyX')], [P('<b>2. Plan.</b><br/>Select Home Node, KDU Campus, or Central Sky Hub.', 'BodyX')], [P('<b>3. Review.</b><br/>Check duration, transfer, safety, and route timeline.', 'BodyX')], [P('<b>4. Track.</b><br/>Follow the journey and switch between map and linear progress views.', 'BodyX')]]
t = Table(flow, colWidths=[170*mm])
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),soft),('BOX',(0,0),(-1,-1),0.5,line),('INNERGRID',(0,0),(-1,-1),0.5,line),('LEFTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),7)]))
story += [t, P('Interaction and accessibility', 'H3X')] + bullet(['Touch-friendly mobile controls and bottom navigation.', 'High-contrast / large-text access mode.', 'Visible selected, active, live, done, now, and next states.', 'ARIA labels for transport, navigation, audio, route, and status controls.', 'Audio can be muted with the persistent sound control.', 'Keyboard shortcuts: 1 Air, 2 Smart Roads, 3 Sub-Rail, Esc/0 reset.'])
story += [P('Live hosted link', 'H3X'), P('<font color="#05677a"><b>https://aurelia-2100.vercel.app</b></font>', 'BodyX'), P('This link is included on the cover and repeated here as the backup reference point. The registered team name is Team Fade and the system name is Aurelia-2100.', 'BodyX')]

doc = SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=16*mm, leftMargin=16*mm, topMargin=16*mm, bottomMargin=17*mm, title='Aurelia-2100 Project Report', author='Team Fade')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
