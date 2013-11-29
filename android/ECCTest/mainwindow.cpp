#include "mainwindow.h"
#include "ui_mainwindow.h"

#include <QLabel>
#include <QLineEdit>
#include <QBoxLayout>

#include "qsvapi.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    QLabel * pLabel = new QLabel(QObject::tr(getSVstr().c_str()));
    QLineEdit* pEdit = new QLineEdit;
    QVBoxLayout* pLayout = new QVBoxLayout;
    pLayout->addWidget( pLabel );
    pLayout->addWidget( pEdit );

    QSize size(200,200);
    QWidget mainWidget;
    mainWidget.setLayout( pLayout );
    mainWidget.resize( size );
    mainWidget.show();

    ui->setupUi(this);
}

MainWindow::~MainWindow()
{
    delete ui;
}
