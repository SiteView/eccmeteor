
#include <QApplication>
#include <QLabel>
#include <QLineEdit>
#include <QBoxLayout>
#include <QtGui/QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQuickWindow>
#include "qtquick2applicationviewer.h"
#include "qsvapi.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
//    QLabel* pLabel = new QLabel( QObject::tr( "Hello Qt!" ) );
    QLabel* pLabel = new QLabel( QObject::tr( getSVstr().c_str() ) );
    QLineEdit* pEdit = new QLineEdit;
    QVBoxLayout* pLayout = new QVBoxLayout;
    pLayout->addWidget( pLabel );
    pLayout->addWidget( pEdit );
//    QSize size = app.desktop()->screenGeometry().size();
    QSize size(200,200);
    QWidget mainWidget;
    mainWidget.setLayout( pLayout );
    mainWidget.resize( size );
    mainWidget.show();

    return app.exec();
}
